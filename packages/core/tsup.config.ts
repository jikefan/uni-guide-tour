import { defineConfig } from 'tsup'
import vuePlugin from 'esbuild-plugin-vue3'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ['vue', 'pinia'],
  esbuildPlugins: [vuePlugin()],
})
