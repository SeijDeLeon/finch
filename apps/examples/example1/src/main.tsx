import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FinchConfigProvider } from '@blueskyproject/finch';
import '@blueskyproject/finch/style.css';
import './index.css';
import App from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* basename keeps routes relative to /finch/example1/ in production */}
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <QueryClientProvider client={queryClient}>
                {/* No backend URLs: this demo runs entirely on simulated and placeholder data. */}
                <FinchConfigProvider config={{}}>
                    <App />
                </FinchConfigProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);
