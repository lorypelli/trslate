import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    target: 'es2015',
    format: 'esm',
    minify: true,
    dts: true,
    clean: true,
});
