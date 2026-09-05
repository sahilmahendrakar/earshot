export const metadata = { title: 'Privacy — Chickadee' };

export default function Privacy() {
  return (
    <div className="sheet">
      <div className="wash wash--tan" aria-hidden="true" />

      <header className="mast">
        <a href="/" className="word">Chickadee</a>
        <span className="note">runs entirely on your machine</span>
      </header>

      <article className="prose">
        <h1>Privacy Policy</h1>
        <div className="date">last updated 4 September 2026</div>

        <p className="lede">
          Chickadee does not collect, transmit, store, or share any personal data.
          There is no server, so there is nothing to collect it with.
        </p>

        <h2>What happens to the page you read</h2>
        <p>Chickadee reads the text of the page you are viewing so it can speak it aloud.
          That text is processed <strong>entirely inside your own browser</strong>. It is never
          sent to us and never sent to a third party. Speech is generated locally by the
          Kokoro-82M model running on your own computer.</p>

        <h2>The only network request</h2>
        <p>On first use, Chickadee downloads the Kokoro-82M voice model (about 310 MB) from
          Hugging Face. This is a one-time download of a static, public file. It is then cached
          in your browser and the extension works offline afterwards. The request contains no
          information about you, the page you are reading, or the text being spoken.</p>

        <h2>What is stored on your device</h2>
        <p>Your chosen voice and default speed are stored with Chrome’s <code>storage.sync</code>{' '}
          API. If you are signed into Chrome these sync across your own devices through your
          Google account, exactly like your other Chrome settings. We have no access to them.
          The voice model is cached in your browser’s storage.</p>

        <h2>Permissions, and why each is needed</h2>
        <ul>
          <li><strong>Access to websites</strong> — required to read the text of whatever page you
            ask it to read. Used only on pages where you explicitly start the reader.</li>
          <li><strong>activeTab, scripting</strong> — to run the reader on the current tab on demand.</li>
          <li><strong>storage</strong> — to remember your voice and speed.</li>
          <li><strong>contextMenus</strong> — to add the “Read aloud from here” right-click item.</li>
        </ul>

        <h2>Analytics and tracking</h2>
        <p>There are none. No analytics, no telemetry, no crash reporting, no cookies,
          no identifiers, no advertising.</p>

        <h2>Changes</h2>
        <p>Any change to this policy will be published with a new version of the extension.</p>

        <h2>Contact</h2>
        <p>Open an issue at <a href="https://github.com/sahilmahendrakar/chickadee/issues">github.com/sahilmahendrakar/chickadee/issues</a>.</p>
      </article>

      <footer>
        <a href="/">← Back</a>
        <span>Chickadee runs entirely on your machine.</span>
      </footer>
    </div>
  );
}
