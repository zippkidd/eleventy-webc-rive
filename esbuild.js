// build.js
import { build } from 'esbuild'

build({
  entryPoints: ['scripts/index.js'],
  bundle: true,
  minify: true,
  outfile: '_site/scripts/bundle.js',
  // outdir: '_site/scripts',
  format: 'esm'
}).catch(() => process.exit(1))
