import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['./src/index.ts'],
  skipNodeModulesBundle: true,
  dts: true,
  shims: true,
  clean: true
})

