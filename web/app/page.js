import fs from 'node:fs';
import path from 'node:path';
import Narrator from './Narrator';

export default function Home() {
  const n = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public/audio/narration.json'), 'utf8')
  );

  return (
    <div className="sheet">
      <div className="wash wash--tan" aria-hidden="true" />

      {/* the masthead lives inside Narrator so the birdsong switch can sit in it */}
      <Narrator sentences={n.sentences} total={n.total} />

      {/* fig. 2 — one real capture, taped into the sketchbook */}
      <section className="showcase">
        <div className="wash wash--sky" aria-hidden="true" />
        <div>
          <span className="fig">fig. 2 — seeing it work</span>
          <h2>It highlights the page you&rsquo;re already&nbsp;on.</h2>
          <p>Not a stripped-down reader view beside the article — the article itself,
             with the spoken sentence lit as it goes.</p>
        </div>

        <figure className="print">
          <div className="tape" aria-hidden="true" />
          <img src="/shots/shot-dark.png"
               alt="Chickadee reading an essay: the sentence currently being spoken is highlighted directly on the page" />
          <figcaption>darioamodei.com/essay/machines-of-loving-grace</figcaption>
        </figure>
      </section>

      <section className="proof">
        <img className="sketch" src="/birds/head-study.webp" alt="" aria-hidden="true" />
        <div>
          <h3>Local and private</h3>
          <p>The model executes in your browser via WebGPU. There is no server to send
             anything to, so there is nothing to leak.</p>
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
        <div className="wash wash--ochre" aria-hidden="true" />
        <div>
          <h2>Install it and press <em>⌥ R</em></h2>
          <p className="req">Chrome, Edge or Arc · requires WebGPU</p>
          {/* TODO: swap for the Chrome Web Store URL once the listing is live */}
          <a className="btn cta" href="#" aria-disabled="true">Add to Chrome — soon</a>
          <p className="reqs">
            Needs a WebGPU-capable browser and machine. Chickadee checks on first run
            and tells you plainly if yours can’t run it.
          </p>
        </div>
        <img className="flyaway" src="/birds/8-flyaway.webp" alt="" aria-hidden="true" />
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Chickadee</span>
        <a href="/privacy">Privacy</a>
        <a href="https://github.com/sahilmahendrakar/chickadee">Source</a>
        <span className="credit">Birdsong: public-domain recordings by G. McGrane and Karlunun</span>
      </footer>
    </div>
  );
}
