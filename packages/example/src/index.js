// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const root = createRoot(document.getElementById('root'));

root.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
);
