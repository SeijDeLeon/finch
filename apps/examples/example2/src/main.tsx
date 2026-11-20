import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FinchConfigProvider } from '@blueskyproject/finch';
import '@blueskyproject/finch/style.css';
import './index.css';
import App from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <QueryClientProvider client={queryClient}>
                <FinchConfigProvider config={{}}>
                    <Routes>
                        {/* Single route for now. Add new ones to static-routes.json as well. */}
                        <Route path="/" element={<App />} />
                    </Routes>
                </FinchConfigProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);
