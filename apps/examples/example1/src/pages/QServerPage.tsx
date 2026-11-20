import { Button, Widget } from '@blueskyproject/finch';
import { useState } from 'react';
import DemoNotice from '../DemoNotice';

type DemoItem = { uid: string; name: string; args: string; status?: 'completed' | 'failed' };

// Placeholder data shaped like Queue Server items. A real app would use Finch's
// ContainerQServer / QueueServer components or its useQueue* hooks against a running RE Manager.
const INITIAL_QUEUE: DemoItem[] = [
    { uid: 'a1f3', name: 'count', args: 'detectors=[det1], num=10' },
    { uid: 'b72c', name: 'scan', args: 'detectors=[det1], motor=motor1, start=-1, stop=1, num=21' },
    { uid: 'c09e', name: 'rel_scan', args: 'detectors=[det1], motor=motor2, start=-0.5, stop=0.5, num=11' },
];
const INITIAL_HISTORY: DemoItem[] = [
    { uid: '9d40', name: 'count', args: 'detectors=[det1], num=1', status: 'completed' },
    { uid: '8e11', name: 'scan', args: 'detectors=[det1], motor=motor1, start=0, stop=5, num=6', status: 'failed' },
];

export default function QServerPage() {
    const [queue, setQueue] = useState(INITIAL_QUEUE);
    const [history, setHistory] = useState(INITIAL_HISTORY);

    // Stand-in for "run next item": moves the head of the queue into history.
    const runNext = () => {
        if (queue.length === 0) return;
        const [next, ...rest] = queue;
        setQueue(rest);
        setHistory((h) => [{ ...next, status: 'completed' }, ...h]);
    };
    const reset = () => {
        setQueue(INITIAL_QUEUE);
        setHistory(INITIAL_HISTORY);
    };

    return (
        <div className="ex-page">
            <DemoNotice>
                The queue below is placeholder data held in the browser. Connect Finch&apos;s Queue
                Server components to a running Bluesky Queue Server to manage real plans.
            </DemoNotice>
            <div className="ex-toolbar">
                <Button text="Run next item" onClick={runNext} disabled={queue.length === 0} />
                <Button text="Reset demo" onClick={reset} isSecondary />
            </div>
            <div className="ex-grid">
                <Widget title={`Queue (${queue.length})`} width="w-full" maxWidth="max-w-full">
                    <ItemTable items={queue} empty="The queue is empty." />
                </Widget>
                <Widget title={`History (${history.length})`} width="w-full" maxWidth="max-w-full">
                    <ItemTable items={history} empty="No history yet." showStatus />
                </Widget>
            </div>
        </div>
    );
}

function ItemTable({ items, empty, showStatus }: { items: DemoItem[]; empty: string; showStatus?: boolean }) {
    if (items.length === 0) return <p className="ex-muted">{empty}</p>;
    return (
        <table className="ex-items">
            <thead>
                <tr>
                    <th scope="col">Plan</th>
                    <th scope="col">Arguments</th>
                    {showStatus && <th scope="col">Status</th>}
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item.uid}>
                        <td>{item.name}</td>
                        <td><code>{item.args}</code></td>
                        {showStatus && <td className={`ex-status ex-${item.status}`}>{item.status}</td>}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
