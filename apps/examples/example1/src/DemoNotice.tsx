/** Banner reminding visitors that nothing on the page talks to real hardware. */
export default function DemoNotice({ children }: { children?: React.ReactNode }) {
    return (
        <p className="ex-demo-notice" role="note">
            <strong>Demonstration.</strong>{' '}
            {children ?? 'This page uses simulated or placeholder data. No beamline backend is connected.'}
        </p>
    );
}
