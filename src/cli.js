#!/usr/bin/env node


const _ = require('lodash')
const Promise = require('bluebird')
const args = require('minimist')(process.argv.slice(2))
const options = _.defaults( args, {
  data: '',
  file: args._[0],
  name: '',
  root: '',
  include: [],
  version: '150',
})


Promise.resolve( run() )
.then( output )

async function run() {
  let shader = await require('./load')( options )
  return shader
}

function output( data ) {
  console.log( data.data )
}
