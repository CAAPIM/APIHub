// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import path from 'path';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    base: './',
    plugins: [
        react(),
        tsconfigPaths(),
        {
            name: 'treat-js-files-as-jsx',
            async transform(code, id) {
                if (!id.match(/src\/.*\.js$/)) return null;

                // Use the exposed transform from vite, instead of directly
                // transforming with esbuild
                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                });
            },
            // jsxImportSource: '@emotion/react',
            // babel: {
            //     plugins: ['@emotion/babel-plugin'],
            // },
        },
    ],
    server: {
        open: true, // automatically open the app in the browser
        port: 3000,
    },
    resolve: {
        alias: {
            screens: path.resolve(__dirname, './src/screens'),
        },
    },
    build: {
        outDir: 'build',
    },
    optimizeDeps: {
        force: true,
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
        include: ['@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
    },
});
