const $ = (id) => document.getElementById(id);
const DEFAULTS = { voice: 'af_heart', speed: 1 };

chrome.storage.sync.get(DEFAULTS, (s) => {
  $('voice').value = s.voice;
  $('speed').value = String(s.speed);
});

function save() {
  const v = { voice: $('voice').value, speed: parseFloat($('speed').value) };
  chrome.storage.sync.set(v, () => {
    const el = $('saved');
    el.textContent = 'Saved — applies to the next read';
    el.classList.add('on');
    setTimeout(() => el.classList.remove('on'), 1800);
  });
}
$('voice').onchange = save;
$('speed').onchange = save;

// The toolbar click now opens this popup, so reading needs an explicit button.
$('read').onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'READ' });
  } catch (e) {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    await chrome.tabs.sendMessage(tab.id, { action: 'READ' });
  }
  window.close();
};
