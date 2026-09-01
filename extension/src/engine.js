// Headless TTS engine. Lives in a hidden iframe (an extension page, so it gets
// the bundled ONNX runtime and WebGPU). It owns the model and the <audio>
// element; the content script owns all visible UI and on-page highlighting.
import { KokoroTTS } from 'kokoro-js';
import { env } from '@huggingface/transformers';

env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('vendor/');
env.allowLocalModels = false;

const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const DTYPE = 'fp32';     // q8 on webgpu is numerically corrupt; wasm is sub-realtime
const DEVICE = 'webgpu';

let tts = null, sentences = [], cache = new Map();
let current = 0, stopped = false, voice = 'af_heart', speed = 1.0;
let audio;

const emit = (msg) => parent.postMessage(msg, '*');

async function synth(i) {
  // Raw model output, untouched. Trimming/normalising the leading and trailing
  // silence was tried and reverted: it made sentence starts and ends sound wrong.
  const raw = await tts.generate(sentences[i], { voice, speed: 1.0 });
  return URL.createObjectURL(raw.toBlob());
}
function getAudio(i) {
  if (i < 0 || i >= sentences.length) return null;
  if (!cache.has(i)) cache.set(i, synth(i).catch(e => { cache.delete(i); throw e; }));
  return cache.get(i);
}
// chunk N+1 and N+2 generate while chunk N plays
function prefetch(i) {
  for (const k of [i + 1, i + 2]) if (k < sentences.length && !cache.has(k)) getAudio(k);
  for (const k of [...cache.keys()]) if (k < i - 2) cache.delete(k);
}

async function play(i) {
  if (stopped || i < 0 || i >= sentences.length) return;
  current = i;
  emit({ type: 'KL_SENTENCE', i, total: sentences.length });
  let url;
  try { url = await getAudio(i); }
  catch (e) { emit({ type: 'KL_STATUS', text: 'Generation failed: ' + (e.message || e) }); return; }
  if (stopped || current !== i) return;
  audio.src = url;
  audio.playbackRate = speed;
  try { await audio.play(); }
  catch (e) { if (e.name === 'NotAllowedError') emit({ type: 'KL_BLOCKED' }); }
  prefetch(i);
}

// Returns a human-readable reason, or null when WebGPU is usable.
async function webgpuProblem() {
  if (!('gpu' in navigator) || !navigator.gpu) {
    return 'This browser has no WebGPU support. Chrome, Edge or Arc 113+ on a recent machine is required.';
  }
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return 'No compatible GPU was found. WebGPU is present but no adapter is available.';
    // presence of an adapter is not enough — the device must actually come up
    const dev = await adapter.requestDevice();
    if (!dev) return 'The GPU could not be initialised for WebGPU.';
    return null;
  } catch (e) {
    return 'WebGPU failed to start: ' + (e && e.message ? e.message : e);
  }
}

async function init(payload) {
  sentences = payload.sentences || [];
  voice = payload.voice || voice;
  speed = payload.speed || speed;
  if (!sentences.length) { emit({ type: 'KL_STATUS', text: 'No readable text found.' }); return; }
  if (!tts) {
    // Hard requirement. There is no usable fallback: q8-on-webgpu is numerically
    // corrupt and every wasm config generates slower than it plays. Check BEFORE
    // downloading ~310MB so an unsupported machine fails in a second, not a minute.
    const why = await webgpuProblem();
    if (why) { emit({ type: 'KL_UNSUPPORTED', reason: why }); return; }
    emit({ type: 'KL_STATUS', text: 'First run: downloading voice (~310 MB, one time)…', busy: true });
    try {
      tts = await KokoroTTS.from_pretrained(MODEL, {
        dtype: DTYPE, device: DEVICE,
        progress_callback: (p) => {
          if (p.status === 'progress' && p.progress != null)
            emit({ type: 'KL_STATUS', text: `Downloading model ${Math.round(p.progress)}%`, busy: true });
        }
      });
    } catch (e) { emit({ type: 'KL_STATUS', text: 'Model failed: ' + (e.message || e) }); return; }
  }
  stopped = false;
  emit({ type: 'KL_FIRST' });
  play(payload.start || 0);
}

document.addEventListener('DOMContentLoaded', () => {
  audio = document.getElementById('audio');
  audio.addEventListener('ended', () => { if (!stopped) play(current + 1); });
  audio.addEventListener('play',  () => emit({ type: 'KL_PLAYING', playing: true }));
  audio.addEventListener('pause', () => { if (!audio.ended) emit({ type: 'KL_PLAYING', playing: false }); });

  window.addEventListener('message', (ev) => {
    const d = ev.data;
    if (!d || typeof d !== 'object') return;
    switch (d.type) {
      case 'KL_INIT':   init(d); break;
      case 'KL_TOGGLE': audio.paused ? audio.play().catch(()=>{}) : audio.pause(); break;
      case 'KL_NEXT':   play(current + 1); break;
      case 'KL_PREV':   play(current - 1); break;
      case 'KL_GOTO':   play(d.i); break;
      case 'KL_SPEED':  speed = d.speed; audio.playbackRate = speed; break;
      case 'KL_VOICE':  voice = d.voice; cache.clear(); play(current); break;
      case 'KL_STOP':   stopped = true; audio.pause(); audio.src = ''; break;
    }
  });
  emit({ type: 'KL_READY' });
});
