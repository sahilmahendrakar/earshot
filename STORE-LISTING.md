# Chrome Web Store listing — draft copy

## Name
Chickadee

## Short description (max 132 chars)
Reads any web page aloud in a natural voice. Runs entirely on your machine — no
account, no API key, nothing uploaded.

## Source code
https://github.com/sahilmahendrakar/chickadee  (Apache-2.0)

## Category
Accessibility  (alternative: Productivity)

## Single purpose (required field)
Chickadee converts the text of the web page the user is viewing into speech and
plays it back, highlighting each sentence as it is read.

## Permission justifications (required, one per permission)

**host_permissions `<all_urls>`**
The extension's sole function is reading aloud whatever page the user is on, so it
must be able to read the text content of arbitrary pages. It only activates on a page
when the user explicitly starts it (toolbar button, Alt+R, or the right-click menu).
No page content leaves the device.

**activeTab**
Used to identify and act on the tab the user has asked to read.

**scripting**
Used to inject the reader into the current tab when the user starts it, including on
tabs that were already open before the extension was installed or updated.

**storage**
Stores only the user's chosen voice and default playback speed.

**contextMenus**
Adds a single "Read aloud from here" item so the user can start reading from a
specific point in the page instead of the top.

**Remote code**
None. The speech engine (ONNX Runtime + kokoro-js) is bundled in the package. The
only network request is a one-time download of a static, public model file from
Hugging Face; it is data consumed by the bundled runtime, not executable code.

## Full description

Chickadee reads any web page aloud in a natural, human-sounding voice, and it does it entirely on your own computer. Nothing you read is ever uploaded, and there is no account, no subscription and no API key.

Open an article and press Alt+R, or click the Chickadee button, and it starts reading from the top, highlighting each sentence on the page itself as it goes. Right-click any word and choose "Read aloud from here" to start partway through. A small floating bar lets you pause, step back and forth between sentences, and change the speed from 0.9x to 2x. Alt+P plays and pauses.

Most read-aloud tools send your page text to a server to generate the speech. Chickadee runs the Kokoro speech model directly in your browser using WebGPU, so the words never leave your machine. There are twelve voices to choose from, American and British, and the one you pick is remembered.

The first time you use it, Chickadee downloads the voice model once (about 310 MB). After that it works offline: on a plane, in a tunnel, anywhere. It needs a Chrome-based browser with WebGPU support on reasonably recent hardware, and it checks on first run and tells you plainly if your machine can't run it.

Chickadee collects nothing and sends nothing. No analytics, no telemetry, no server. It is open source under the Apache 2.0 licence: https://github.com/sahilmahendrakar/chickadee

## Screenshots needed (1280x800 or 640x400, up to 5)
1. An article mid-read with a sentence highlighted and the floating bar visible
2. The right-click menu showing "Read aloud from here"
3. The settings popup with the voice list open
4. A dark-themed page being read (shows the adaptive highlight)
5. Optional: the first-run download notice
