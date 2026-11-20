// Placeholder styling. Final visual design will follow mockups.

/** Base path of the combined site: "/finch/" in production, "/" in standalone dev. */
const BASE = import.meta.env.BASE_URL;
const REPO_URL = 'https://github.com/bluesky/finch';

const examples = [
    {
        path: 'example1/',
        title: 'Example 1 — Beamline dashboard',
        description:
            'A multi-page app built with FinchAppLayout: a home overview, a Queue Server page and a Controls page with simulated devices.',
    },
    {
        path: 'example2/',
        title: 'Example 2 — Signal monitor',
        description:
            'A small, separately built monitoring dashboard showing live simulated signals and plots.',
    },
];

export default function App() {
    return (
        <>
            <header className="site-header">
                <nav aria-label="Primary" className="container nav">
                    <a href={BASE} className="brand">
                        <img src={`${BASE}finchIconCircle.png`} alt="" width={32} height={32} />
                        Finch
                    </a>
                    <ul>
                        <li><a href={`${BASE}storybook/`}>Components</a></li>
                        <li><a href="#examples">Examples</a></li>
                        <li><a href={REPO_URL}>GitHub</a></li>
                    </ul>
                </nav>
            </header>

            <main id="main" className="container">
                <section className="hero" aria-labelledby="hero-title">
                    <h1 id="hero-title">Finch</h1>
                    <p className="lead">
                        A React component library for building Bluesky-powered beamline and scientific
                        applications.
                    </p>
                    <div className="actions">
                        <a className="button primary" href={`${BASE}storybook/`}>
                            Browse the component docs (Storybook)
                        </a>
                        <a className="button" href="#examples">
                            See full examples
                        </a>
                    </div>
                </section>

                <section aria-labelledby="install-title">
                    <h2 id="install-title">Install</h2>
                    <pre><code>npm install @blueskyproject/finch</code></pre>
                    <p>
                        Then follow the{' '}
                        <a href={`${REPO_URL}#installation`}>getting started guide</a> to set up the
                        providers and import <code>@blueskyproject/finch/style.css</code>.
                    </p>
                </section>

                <section id="examples" aria-labelledby="examples-title">
                    <h2 id="examples-title">Full examples</h2>
                    <p>
                        Complete, independently built React apps that use Finch the way your app would.
                        They run entirely in the browser with simulated or placeholder data. No beamline
                        backend is connected.
                    </p>
                    <ul className="cards">
                        {examples.map((ex) => (
                            <li key={ex.path} className="card">
                                <h3>
                                    <a href={`${BASE}${ex.path}`}>{ex.title}</a>
                                </h3>
                                <p>{ex.description}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                <section aria-labelledby="links-title">
                    <h2 id="links-title">Learn more</h2>
                    <ul>
                        <li><a href={REPO_URL}>Source code on GitHub</a></li>
                        <li><a href={`${REPO_URL}#installation`}>Installation and app setup</a></li>
                        <li><a href={`${REPO_URL}/issues`}>Report an issue</a></li>
                        <li><a href="https://blueskyproject.io/">The Bluesky Project</a></li>
                    </ul>
                </section>
            </main>

            <footer className="container footer">
                <p>Finch is part of the Bluesky Project. BSD-3-Clause licensed.</p>
            </footer>
        </>
    );
}
