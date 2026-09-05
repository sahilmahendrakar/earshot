# Privacy Policy — Chickadee

_Last updated: 4 September 2026_

**Chickadee does not collect, transmit, store, or share any personal data.**

## What the extension does with your data
Chickadee reads the text of the web page you are currently viewing so it can
speak it aloud. That text is processed **entirely inside your own browser**. It is
never sent to us, and never sent to any third party.

Speech is generated locally by the Kokoro-82M model running on your own computer.
There is no server component, no API key, and no account.

## The only network request the extension makes
On first use, the extension downloads the Kokoro-82M voice model (approximately
310 MB) from Hugging Face (`huggingface.co` and its CDN). This is a one-time
download of a static, public model file. It is then cached in your browser and the
extension works offline afterwards.

That request contains no information about you, the page you are reading, or the
text being spoken.

## What is stored on your device
Your chosen voice and default playback speed are stored using Chrome's `storage.sync`
API. If you are signed into Chrome, this syncs across your own devices via your
Google account, exactly like your other Chrome settings. We have no access to it.

The downloaded voice model is cached in your browser's storage.

## Permissions and why they are needed
- **`activeTab`** — access to the one page you ask it to read, granted only when you
  start the reader (toolbar button, Alt+R, or the right-click menu). The extension
  has no access to any other tab and is never loaded into pages ahead of time.
- **`scripting`** — to run the reader on that tab on demand.
- **`storage`** — to remember your voice and speed preferences.
- **`contextMenus`** — to add the "Read aloud from here" right-click item.

## Analytics and tracking
There are none. No analytics, no telemetry, no crash reporting, no cookies, no
identifiers, no advertising.

## Changes
Any change to this policy will be published with a new version of the extension.

## Contact
Open an issue at https://github.com/sahilmahendrakar/chickadee/issues
