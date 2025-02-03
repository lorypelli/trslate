import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    target: 'es2015',
    format: ['cjs'],
    minify: true,
    dts: true,
    clean: true,
});
