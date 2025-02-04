import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig([
    {
        entry: ['src/index.ts'],
        target: 'es2015',
        format: ['esm', 'iife'],
        globalName: '_',
        minify: true,
        dts: true,
        clean: true,
        onSuccess: async () => {
            writeFileSync(
                'dist/browser.js',
                `${readFileSync('dist/index.global.js', 'utf8').trim()}${readFileSync('src/global.js', 'utf8').trim()}\n`,
            );
            rmSync('dist/index.global.js');
        },
    },
]);
