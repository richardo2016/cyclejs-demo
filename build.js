const fs = require('fs')
const path = require('path')

const builtInModules = require('@fibjs/builtin-modules')

const { default: rollup, plugins } = require('fib-rollup')

const commonjs = require('rollup-plugin-commonjs')

// package server js
rollup.rollup({
  input: path.resolve(__dirname, './src/server/index.ts'),
  external: builtInModules,
  plugins: [
    plugins['rollup-plugin-fibjs-resolve'](),
    commonjs()
  ]
})
  .then(bundle => {
    return bundle.write({
      file: path.resolve(__dirname, './lib/server/index.js'),
      format: 'cjs'
    })
  })
  .catch(e => console.error(e.stack))

// package client js
rollup.rollup({
  input: path.resolve(__dirname, './src/browser/index.ts'),
  plugins: [
    plugins['rollup-plugin-fibjs-resolve'](),
    require('rollup-plugin-buble')(),
    commonjs(),
    plugins['rollup-plugin-uglify-js']()
  ]
})
  .then(bundle => {
    return bundle.write({
      file: path.resolve(__dirname, './lib/browser/index.js'),
      format: 'umd',
      name: 'app'
    })
  })
  .then(() => {
    fs.copy(
      path.resolve(__dirname, './src/browser/index.html'),
      path.resolve(__dirname, './lib/browser/index.html')
    )
  })
  .catch(e => console.error(e.stack))
