import fs from 'fs'
import { minify } from 'terser'

const TERSER_NAME_CACHE = {}
const DEFAULT_TERSER_OPTIONS = {
  compress: { // https://github.com/terser/terser#compress-options
    passes: 3
  },
  mangle: { // https://github.com/terser/terser#mangle-options
    properties: {
      regex: /^[_#]/ // https://makandracards.com/makandra/608582
    }
  },
  ecma: 2021,
  nameCache: TERSER_NAME_CACHE // preserve renames across files
}

export function terserPlugin (terserOptions = DEFAULT_TERSER_OPTIONS) {
  return {
    name: 'terserPlugin',
    setup (build) {
      build.onLoad({ filter: /\.js$/ }, async (args) => {
        // console.log('build.onLoad')
        const text = await fs.promises.readFile(args.path, 'utf8')
        const { code, map } = await minify(text, terserOptions)
        // console.log('minified', code)
        return {
          contents: code,
          loader: 'js'
        }
      })
    }
  }
}
