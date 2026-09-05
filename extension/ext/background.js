// The reader is never injected ahead of time. Every entry point here (toolbar,
// keyboard command, context menu) is a user gesture that grants activeTab for that
// tab, and that is the only page access the extension has.
async function send(tabId, msg) {
  try { return await chrome.tabs.sendMessage(tabId, msg); }
  catch (e) {
    // Content script not present on this page yet — inject it.
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
    return await chrome.tabs.sendMessage(tabId, msg);
  }
}
async function active() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}
chrome.action.onClicked.addListener(async (tab) => { if (tab?.id) await send(tab.id, { action: 'READ' }); });
chrome.commands.onCommand.addListener(async (cmd) => {
  const tab = await active();
  if (!tab?.id) return;
  if (cmd === 'read-article') await send(tab.id, { action: 'READ' });
  else if (cmd === 'toggle-play') await send(tab.id, { action: 'TOGGLE' });
});

function installMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'kokoro-read-from-here',
      title: 'Read aloud from here',
      contexts: ['page', 'selection', 'link']
    });
  });
}
chrome.runtime.onInstalled.addListener(installMenu);
chrome.runtime.onStartup.addListener(installMenu);
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'kokoro-read-from-here' && tab?.id) {
    await send(tab.id, { action: 'READ_FROM_POINT' });
  }
});
