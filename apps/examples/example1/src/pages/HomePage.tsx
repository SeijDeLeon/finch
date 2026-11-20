import { Link } from 'react-router';
import { SignalMonitorPlotDevice, Widget, useSimOphydPVSocket } from '@blueskyproject/finch';
import DemoNotice from '../DemoNotice';

const SIM_SIGNALS = ['sineSignal', 'noisySignal'];

export default function HomePage() {
    const { devices } = useSimOphydPVSocket(SIM_SIGNALS);

    return (
        <div className="ex-page">
            <DemoNotice />
            <section className="ex-intro">
                <h2>Welcome to the example beamline</h2>
                <p>
                    This is a complete React app built with <code>@blueskyproject/finch</code>. The
                    sidebar comes from <code>FinchAppLayout</code>, and each page is a normal React
                    Router route.
                </p>
                <ul>
                    <li>
                        <Link to="/qserverpage">Queue Server</Link>: a queue and history view with
                        placeholder plans.
                    </li>
                    <li>
                        <Link to="/controls">Controls</Link>: motor controllers driven by Finch&apos;s
                        simulated ophyd socket.
                    </li>
                </ul>
            </section>
            <div className="ex-grid">
                <Widget title="Beam intensity (simulated)" width="w-full" maxWidth="max-w-full">
                    <SignalMonitorPlotDevice device={devices['sineSignal']} deviceLabel="I0" />
                </Widget>
                <Widget title="Detector noise (simulated)" width="w-full" maxWidth="max-w-full">
                    <SignalMonitorPlotDevice
                        device={devices['noisySignal']}
                        deviceLabel="Noise"
                        color="#f97316"
                    />
                </Widget>
            </div>
        </div>
    );
}
