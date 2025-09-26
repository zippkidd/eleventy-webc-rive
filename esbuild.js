import { build } from 'esbuild'
import { terserPlugin } from './esbuild.config.js'

// async function minifyWithTerser (code) {
//   console.log('running minify with terser...')
//   const result = await minify(code)
//   console.log(result.code)
//   return result.code
// }

build({
  entryPoints: ['scripts/index.js'],
  bundle: true,
  minify: true,
  outfile: '_site/scripts/bundle.js',
  // outdir: '_site/scripts',
  format: 'esm',
  plugins: [
    terserPlugin()
    // {
    //   name: 'minify-with-terser',
    //   setup (build) {
    //     build.onEnd(async (result) => {
    //       console.log('esbuild onEnd', result)
    //       if (result.outputFiles) {
    //         for (const file of result.outputFiles) {
    //           const minifiedCode = await minifyWithTerser(file.text)
    //           file.text = minifiedCode
    //         }
    //       }
    //     })
    //   }
    // }
  ]
}).catch(() => process.exit(1))
