// build.js
import { context } from 'esbuild'

const args = process.argv.slice(2)
const isWatch = args.includes('--watch')

async function runBuild () {
  const ctx = await context({
    entryPoints: ['scripts/index.js'],
    bundle: true,
    minify: true,
    outfile: '_site/scripts/bundle.js',
    format: 'esm'
  })

  if (isWatch) {
    await ctx.watch()
    console.log('Watching for changes...')
  } else {
    await ctx.rebuild()
    await ctx.dispose()
  }
}

runBuild().catch(() => process.exit(1))
