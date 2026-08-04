import { defineConfig } from 'vite';
import { resolve } from 'path';

// Bundled deps (chart.js, three, lenis, gsap) need their license notice
// carried in the built output — see scripts/add-license-banner.mjs, which
// runs as this project's `build` script (package.json), and
// ../THIRD-PARTY-LICENSES.md for full texts. (Rollup's own
// rollupOptions.output.banner did not propagate through this Vite 6 build,
// hence the separate postbuild step instead.)

export default defineConfig({
  base: './',
  build: {
    outDir: resolve(__dirname, '../docs'),
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        showcase: resolve(__dirname, 'showcase.html'),
      },
      output: {
        entryFileNames: 'main.[hash].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
});
