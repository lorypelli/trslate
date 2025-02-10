import { readFileSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

const defaults = defineConfig({
    target: 'es2015',
    minify: true,
    clean: true,
});

export default defineConfig([
    {
        ...defaults,
        entry: ['src/index.ts'],
        format: 'esm',
        dts: true,
    },
    {
        ...defaults,
        entry: { browser: 'src/index.ts' },
        format: 'iife',
        globalName: '__iife__',
        outExtension: () => ({ js: '.js' }),
        onSuccess: async () => {
            writeFileSync(
                'dist/browser.js',
                readFileSync('dist/browser.js', 'utf8').replace(
                    'var __iife__',
                    'const{TContext}',
                ),
            );
        },
    },
]);
