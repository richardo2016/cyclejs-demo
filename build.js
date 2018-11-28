const fs = require('fs')
const path = require('path')
const coroutine = require('coroutine')

const builtInModules = require('@fibjs/builtin-modules')

const { plugins, getCustomizedVBox } = require('fib-rollup')

const vbox = getCustomizedVBox()
require('fib-typify').registerTsCompiler(vbox)

const rollup = vbox.require('rollup', __dirname)

const commonjs = require('rollup-plugin-commonjs')

// package server js
function buildServer () {
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
}

const clientVendors = {
  '@cycle/run': 'vendor.cycleJS.run',
  '@cycle/dom': 'vendor.cycleJS.dom'
}

function buildClient () {
  // package client js
  rollup.rollup({
    input: path.resolve(__dirname, './src/browser/index.ts'),
    external: Object.keys(clientVendors),
    plugins: [
      plugins['rollup-plugin-fibjs-resolve']({vbox}),
      require('rollup-plugin-buble')(),
      commonjs(),
      plugins['rollup-plugin-uglify-js']()
    ]
  })
    .then(bundle => {
      return bundle.write({
        file: path.resolve(__dirname, './lib/browser/index.js'),
        format: 'umd',
        output: {
          globals: clientVendors
        },
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
}

function buildClientVendor () {
  // package client js
  rollup.rollup({
    input: path.resolve(__dirname, './src/browser/vendor.ts'),
    plugins: [
      plugins['rollup-plugin-fibjs-resolve'](),
      require('rollup-plugin-buble')(),
      commonjs()
    ]
  })
    .then(bundle => {
      return bundle.write({
        file: path.resolve(__dirname, './lib/browser/vendor.js'),
        format: 'iife',
        output: {
          globals: clientVendors
        },
        name: 'vendor'
      })
    })
    .catch(e => console.error(e.stack))
}

buildServer()

buildClientVendor()
buildClient()

if (process.env.DEV) {
  require('./lib/server')

  coroutine.start(() => {
    let count = 0
    while(true) {
      buildClient()
      console.log(`finish buildClient ${count++} times`)
      coroutine.sleep(1000)
    }
  })
}