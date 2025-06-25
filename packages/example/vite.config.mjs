// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import path from 'path';
import { defineConfig, transformWithEsbuild, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import svgr from "vite-plugin-svgr";


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const PORT = parseInt(env.PORT) || 3000;
    const HOST = env.HOST || 't1.dev.ca.com';

    return {
        base: './',
        define: {
            global: 'window',
        },
        plugins: [
            react(),
            {
                name: 'treat-js-files-as-jsx',
                async transform(code, id) {
                    if (!id.match(/src\/.*\.js$/)) return null

                    // Use the exposed transform from vite, instead of directly
                    // transforming with esbuild
                    return transformWithEsbuild(code, id, {
                        loader: 'jsx',
                        jsx: 'automatic',
                    })
                },
                // !! need this section after MUI 5 update
                // jsxImportSource: '@emotion/react',
                // babel: {
                //     plugins: ['@emotion/babel-plugin'],
                // },
            },
            svgr(),
            basicSsl(),
        ],
        server: {
            host: HOST,
            open: true, // automatically open the app in the browser
            port: PORT,
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
            include: [
                '@emotion/react',
                '@emotion/styled',
                '@mui/material/Tooltip'
            ],
        }
    }
});