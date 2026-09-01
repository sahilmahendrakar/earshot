import { KokoroTTS } from 'kokoro-js';
import { env } from '@huggingface/transformers';

// MV3 forbids remote code, so the ONNX runtime ships inside the extension.
env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('vendor/');
// We bundle the runtime; don't let transformers reach for a CDN copy.
env.allowLocalModels = false;

const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';
// fp32 + webgpu is the ONLY viable config: q8 on webgpu is numerically corrupt
// (produces garbled audio), and every wasm config runs slower than realtime.
const DTYPE = 'fp32';
const DEVICE = 'webgpu';

const $ = (id) => document.getElementById(id);
const els = {};
let tts = null;
let sentences = [];
let cache = new Map();      // index -> Promise<objectURL>
let current = 0;
let paused = false;
let stopped = false;
let voice = 'af_heart';
let wordSpans = [];   // index -> [span per word]
let wordTimes = [];   // index -> [cumulative fraction per word]
let activeWord = null;
let speed = 1.0;

/* ---------------- sentence segmentation ---------------- */
// Kokoro has a ~510-token limit, so long text MUST be chunked. Splitting on
// sentences also gives us the unit for highlighting and prefetch.
function splitSentences(text) {
  const ABBR = /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|e\.g|i\.e|al|Inc|Ltd|Co|Fig|No|pp)\.$/i;
  const out = [];
  let buf = '';
  for (const part of text.split(/(?<=[.!?])\s+/)) {
    buf = buf ? buf + ' ' + part : part;
    if (ABBR.test(buf.trim())) continue;        // "Dr." isn't a sentence end
    if (buf.trim().length < 2) continue;
    out.push(buf.trim());
    buf = '';
  }
  if (buf.trim()) out.push(buf.trim());
  // Hard-split anything still too long for the model's context.
  const MAX = 380;
  const final = [];
  for (const s of out) {
    if (s.length <= MAX) { final.push(s); continue; }
    let rest = s;
    while (rest.length > MAX) {
      let cut = rest.lastIndexOf(', ', MAX);
      if (cut < MAX * 0.5) cut = rest.lastIndexOf(' ', MAX);
      if (cut <= 0) cut = MAX;
      final.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) final.push(rest);
  }
  return final.filter(Boolean);
}

/* ---------------- generation + prefetch ---------------- */
async function synth(index) {
  const raw = await tts.generate(sentences[index], { voice, speed: 1.0 });
  return URL.createObjectURL(raw.toBlob());
}
function getAudio(index) {
  if (index < 0 || index >= sentences.length) return null;
  if (!cache.has(index)) cache.set(index, synth(index).catch(e => { cache.delete(index); throw e; }));
  return cache.get(index);
}
// THE killer feature: chunk N+1 generates while chunk N plays.
function prefetch(index) {
  for (const i of [index + 1, index + 2]) {
    if (i < sentences.length && !cache.has(i)) getAudio(i);
  }
  // don't let the cache grow without bound on a long article
  for (const k of cache.keys()) if (k < index - 2) cache.delete(k);
}

/* ---------------- rendering ---------------- */
// Kokoro gives us audio but no word timings. We do know each sentence's exact
// duration, so we distribute its words across that span weighted by length, with
// extra weight for punctuation (commas and full stops get real pauses in speech).
// It drifts slightly mid-sentence but re-syncs at every sentence boundary, which
// is enough to read along by.
function wordWeights(words) {
  return words.map(w => {
    const letters = w.replace(/[^A-Za-z0-9']/g, '').length || 1;
    const pause = /[.!?]["')\]]?$/.test(w) ? 3.0
                : /[,;:—-]$/.test(w)        ? 1.5
                : 0;
    return letters + pause;
  });
}
function renderText() {
  els.text.innerHTML = '';
  wordSpans = [];
  wordTimes = [];
  sentences.forEach((s, i) => {
    const span = document.createElement('span');
    span.className = 'sentence';
    span.dataset.i = i;
    span.onclick = () => play(i);
    const words = s.split(/\s+/).filter(Boolean);
    const spans = [];
    words.forEach((w, j) => {
      const ws = document.createElement('span');
      ws.className = 'word';
      ws.textContent = w;
      span.appendChild(ws);
      if (j < words.length - 1) span.appendChild(document.createTextNode(' '));
      spans.push(ws);
    });
    span.appendChild(document.createTextNode(' '));
    wordSpans[i] = spans;
    // cumulative fractions 0..1, one boundary per word
    const wts = wordWeights(words);
    const total = wts.reduce((a, b) => a + b, 0) || 1;
    let acc = 0;
    wordTimes[i] = wts.map(w => { acc += w; return acc / total; });
    els.text.appendChild(span);
  });
}
function clearWords() {
  if (activeWord) { activeWord.classList.remove('active'); activeWord = null; }
}
function updateWord() {
  const spans = wordSpans[current], fracs = wordTimes[current];
  const dur = els.audio.duration;
  if (!spans || !fracs || !isFinite(dur) || dur <= 0) return;
  const f = Math.min(0.999, els.audio.currentTime / dur);
  let k = fracs.findIndex(x => f < x);
  if (k < 0) k = spans.length - 1;
  const el = spans[k];
  if (el && el !== activeWord) {
    if (activeWord) activeWord.classList.remove('active');
    el.classList.add('active');
    activeWord = el;
  }
}
function highlight(i) {
  clearWords();
  els.text.querySelectorAll('.sentence.active').forEach(e => e.classList.remove('active'));
  const el = els.text.querySelector(`.sentence[data-i="${i}"]`);
  if (el) {
    el.classList.add('active');
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  els.status.textContent = `${i + 1} / ${sentences.length}`;
  els.progress.style.width = ((i + 1) / sentences.length * 100) + '%';
}

/* ---------------- playback ---------------- */
async function play(index) {
  if (stopped || index < 0 || index >= sentences.length) return;
  current = index;
  highlight(index);
  els.spinner.style.display = 'block';
  let url;
  try {
    url = await getAudio(index);
  } catch (e) {
    els.spinner.style.display = 'none';
    els.status.textContent = 'Generation failed: ' + (e.message || e);
    return;
  }
  els.spinner.style.display = 'none';
  if (current !== index || stopped) return;   // user navigated away while we waited
  els.audio.src = url;
  els.audio.playbackRate = speed;
  if (!paused) {
    try { await els.audio.play(); }
    catch (e) {
      // autoplay policy: needs one real user gesture
      if (e.name === 'NotAllowedError') { paused = true; els.play.textContent = '▶'; els.status.textContent = 'Press play to start'; }
    }
  }
  prefetch(index);
}
function next() { play(current + 1); }
function prev() { play(current - 1); }

/* ---------------- boot ---------------- */
async function init(payload) {
  els.title.textContent = payload.title || 'Reader';
  sentences = splitSentences(payload.text || '');
  if (!sentences.length) { els.status.textContent = 'No readable text found.'; return; }
  renderText();
  els.status.textContent = `Loading model (first run downloads ~300 MB)…`;
  try {
    tts = await KokoroTTS.from_pretrained(MODEL, {
      dtype: DTYPE, device: DEVICE,
      progress_callback: (p) => {
        if (p.status === 'progress' && p.progress != null) {
          els.status.textContent = `Downloading model ${Math.round(p.progress)}%`;
          els.progress.style.width = p.progress + '%';
        }
      }
    });
  } catch (e) {
    els.status.textContent = 'Model failed to load: ' + (e.message || e);
    return;
  }
  els.status.textContent = 'Ready';
  els.progress.style.width = '0%';
  play(0);
}

document.addEventListener('DOMContentLoaded', () => {
  for (const k of ['title','text','status','play','prevBtn','nextBtn','minBtn','closeBtn','audio','spinner','progress','speed','voice'])
    els[k] = $(k);

  els.audio.addEventListener('ended', () => { if (!stopped) setTimeout(next, 40); });
  els.audio.addEventListener('timeupdate', updateWord);
  els.play.onclick = () => {
    if (els.audio.paused) { paused = false; els.audio.play(); els.play.textContent = '❚❚'; }
    else { paused = true; els.audio.pause(); els.play.textContent = '▶'; }
  };
  els.audio.addEventListener('play',  () => { paused = false; els.play.textContent = '❚❚'; });
  els.audio.addEventListener('pause', () => { if (!els.audio.ended) els.play.textContent = '▶'; });
  els.prevBtn.onclick = prev;
  els.nextBtn.onclick = next;
  els.minBtn.onclick   = () => parent.postMessage('KL_MINIMIZE', '*');
  els.closeBtn.onclick = () => { stopped = true; els.audio.pause(); parent.postMessage('KL_CLOSE', '*'); };
  els.speed.onchange = (e) => { speed = parseFloat(e.target.value); els.audio.playbackRate = speed; };
  els.voice.onchange = (e) => {
    voice = e.target.value;
    cache.clear();                       // voice changed: old audio is stale
    play(current);
  };
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); els.play.click(); }
  });
  window.addEventListener('message', (ev) => {
    const d = ev.data;
    if (!d || typeof d !== 'object') {
      if (d === 'KL_TOGGLE') els.play.click();
      else if (d === 'KL_NEXT') next();
      else if (d === 'KL_PREV') prev();
      return;
    }
    if (d.type === 'KL_INIT') init(d);
  });
  parent.postMessage('KL_READY', '*');
});
