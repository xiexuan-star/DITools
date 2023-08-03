import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  bundle: true,
  splitting: true,
  outDir: 'dist',
  format: ['cjs'],
  dts: false,
  clean: true,
  external: ['lodash/fp'],
  minify: true,
  treeshake: 'safest'
});
