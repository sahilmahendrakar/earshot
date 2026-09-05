# Chrome Web Store listing — draft copy

## Name
Chickadee — Read Pages Aloud

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

Chickadee reads web pages aloud in a natural, human-sounding voice — and it does
it entirely on your own computer.

No account. No subscription. No API key. Nothing you read is ever uploaded.

HOW IT WORKS
Most read-aloud tools stream your page text to a server to generate speech. Chickadee
runs the Kokoro-82M speech model directly in your browser using WebGPU, so the
page you are reading never leaves your machine. After a one-time model download it
works completely offline.

FEATURES
• Highlights each sentence on the real page as it is read — not in a separate reader pane
• Right-click any word and choose "Read aloud from here" to start mid-article
• 12 voices, including several rated A and B for quality
• Adjustable speed from 0.9x to 2x
• Keyboard shortcuts: Alt+R to read, Alt+P to play/pause
• Compact floating controls that stay out of the way

REQUIREMENTS
• A browser and machine with WebGPU support (Chrome/Edge/Arc 113+ on reasonably
  recent hardware). The extension checks this on first run and tells you clearly if
  your system cannot run it.
• A one-time ~310 MB voice model download on first use. Cached afterwards.

PRIVACY
Chickadee collects nothing and transmits nothing. There is no analytics, no
telemetry, and no server. The only network request it ever makes is the one-time
model download from Hugging Face.

SOURCE
Chickadee is open source, Apache-2.0: https://github.com/sahilmahendrakar/chickadee

OPEN SOURCE COMPONENTS
Kokoro-82M (Apache-2.0), kokoro-js (Apache-2.0), Transformers.js (Apache-2.0),
ONNX Runtime Web (MIT).

## Screenshots needed (1280x800 or 640x400, up to 5)
1. An article mid-read with a sentence highlighted and the floating bar visible
2. The right-click menu showing "Read aloud from here"
3. The settings popup with the voice list open
4. A dark-themed page being read (shows the adaptive highlight)
5. Optional: the first-run download notice
