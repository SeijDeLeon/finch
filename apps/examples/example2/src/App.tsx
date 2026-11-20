import { useEffect, useState } from 'react';
import { Paper, PlotlyHeatmap, SignalMonitorPlotDevice, useSimOphydPVSocket } from '@blueskyproject/finch';

const SIGNALS = ['sineSignal', 'noisySignal'];
const SIZE = 48;

/** A drifting 2D Gaussian with noise, standing in for a detector frame. */
function makeFrame(t: number): number[][] {
    const cx = SIZE / 2 + Math.cos(t) * 8;
    const cy = SIZE / 2 + Math.sin(t) * 8;
    return Array.from({ length: SIZE }, (_, y) =>
        Array.from({ length: SIZE }, (_, x) => {
            const r2 = (x - cx) ** 2 + (y - cy) ** 2;
            return Math.round(1000 * Math.exp(-r2 / 40) + Math.random() * 60);
        }),
    );
}

export default function App() {
    const { devices } = useSimOphydPVSocket(SIGNALS);
    const [frame, setFrame] = useState(() => makeFrame(0));

    useEffect(() => {
        let t = 0;
        const id = setInterval(() => {
            t += 0.25;
            setFrame(makeFrame(t));
        }, 500);
        return () => clearInterval(id);
    }, []);

    const sine = devices['sineSignal'];

    return (
        <div className="ex-app">
            <header className="ex-app-header">
                <h1>Signal Monitor</h1>
                <p>
                    A single-page Finch example. All signals are simulated in the browser; no
                    beamline backend is connected.
                </p>
            </header>
            <main className="ex-dashboard">
                <Paper size="full" className="ex-card">
                    <h2>Current value</h2>
                    <p className="ex-big-number" aria-live="polite">
                        {typeof sine?.value === 'number' ? sine.value.toFixed(1) : '…'}{' '}
                        <span>{sine?.units}</span>
                    </p>
                </Paper>
                <Paper size="full" className="ex-card">
                    <SignalMonitorPlotDevice device={sine} deviceLabel="Sine signal" />
                </Paper>
                <Paper size="full" className="ex-card">
                    <SignalMonitorPlotDevice
                        device={devices['noisySignal']}
                        deviceLabel="Noisy signal"
                        color="#a855f7"
                    />
                </Paper>
                <Paper size="full" className="ex-card">
                    <PlotlyHeatmap array={frame} title="Simulated detector" colorScale="Viridis" />
                </Paper>
            </main>
        </div>
    );
}
