import { FinchAppLayout, type RouteItem } from '@blueskyproject/finch';
import { House, ListChecks, Sliders } from '@phosphor-icons/react';
import HomePage from './pages/HomePage';
import QServerPage from './pages/QServerPage';
import ControlsPage from './pages/ControlsPage';

// Keep these paths in sync with static-routes.json so direct loads work on GitHub Pages.
const routes: RouteItem[] = [
    { path: '/', label: 'Home', icon: <House size={32} />, element: <HomePage /> },
    {
        path: '/qserverpage',
        label: 'Queue Server',
        icon: <ListChecks size={32} />,
        element: <QServerPage />,
    },
    { path: '/controls', label: 'Controls', icon: <Sliders size={32} />, element: <ControlsPage /> },
];

export default function App() {
    return (
        <FinchAppLayout
            routes={routes}
            headerTitle="Finch Example Beamline"
            headerLogoUrl={`${import.meta.env.BASE_URL}finchIconCircle.png`}
        />
    );
}
