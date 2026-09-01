import fs from 'node:fs';
import path from 'node:path';
import Narrator from './Narrator';

export default function Home() {
  const n = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/audio/narration.json'), 'utf8')
  );

  return (
    <div className="shell">
      <header className="mast">
        <img src="/icon.png" alt="" />
        <span className="word">Earshot</span>
        <span className="meta">Runs <b>entirely</b> on your machine</span>
      </header>

      <Narrator sentences={n.sentences} total={n.total} />

      <section className="proof">
        <div>
          <h3>Local, not "private"</h3>
          <p>Not a promise in a policy — an architecture. The model executes in your browser
             via WebGPU. There is no server to send anything to, so there is nothing to leak.</p>
        </div>
        <div>
          <h3>Reads the real page</h3>
          <p>Sentences are highlighted on the page itself, not in a stripped-down reader pane.
             Right-click any word to start from there.</p>
        </div>
        <div>
          <h3>Works offline</h3>
          <p>One ~310 MB voice download on first use. After that it never touches the network
             again — on a plane, in a tunnel, forever.</p>
        </div>
        <div>
          <h3>Free forever</h3>
          <p>Open source, Apache-2.0 components, no subscription and no upsell. Kokoro-82M,
             ONNX Runtime and Transformers.js do the work.</p>
        </div>
      </section>

      <section className="install">
        <h2>Install it and press <em style={{fontStyle:'italic'}}>⌥R</em></h2>
        <p>Chrome, Edge or Arc · requires WebGPU</p>
        {/* TODO: swap for the Chrome Web Store URL once the listing is live */}
        <a className="cta" href="#" aria-disabled="true">Add to Chrome — soon</a>
        <p className="reqs">
          Needs a WebGPU-capable browser and machine. Earshot checks on first run
          and tells you plainly if yours can’t run it.
        </p>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Earshot</span>
        <a href="/privacy">Privacy</a>
        <a href="https://github.com/sahilmahendrakar/earshot">Source</a>
        <span className="sp">Voice: Kokoro-82M · af_heart · generated locally</span>
      </footer>
    </div>
  );
}
