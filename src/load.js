module.exports = load

const _ = require('lodash')
    , fs = require('fs-extra')
    , os = require('os')
    , pathlib = require('path')
    , Promise = require('bluebird')
    , search = require('./search')
    , header = require('./header')

async function load( {
  data,
  file,
  root,
  include,
  version,
  type
} ) {
  root = root || process.cwd()

  if ( !Array.isArray( include ) ) {
    include = [ include ]
  }

  if ( file ) {
    include = [ pathlib.dirname( file ) ].concat( include )
    file = pathlib.resolve( root, file )
  }


  include = include.filter( ( inc ) => !!inc )

  var error = null
  var lines
  var watch = []

  if ( data )
    lines = await loadData( data )
  else if ( file )
    lines = await loadFile( file )
  else
    throw new Error('no input')

  lines = _.flatten( lines )
  data = lines.join( os.EOL )

  if ( file )
    file = pathlib.relative( root, file )

  watch = watch.map( ( file ) => pathlib.relative( root, file ) )

  data = header( { data, version, type } )

  return {
    root,
    file,
    error,
    watch,
    data
  }

  async function loadFile( file ) {
    if ( watch.includes( file ) )
      return []

    watch.push( file )

    try {
      var data = await fs.readFile( file, 'utf8' )
    } catch ( err ) {
      error = error || {}

      return []
    }
    return loadData( data, pathlib.dirname( file ) )
  }

  async function loadData( data, alsoInclude ) {
    let lines = data.split( /\r?\n/ )
    lines = await Promise.map( lines, async ( line ) => {
      let match
      if ( match = /\#include [\'\"](.*?)[\'\"]/.exec( line ) ) {
        let includeFile = match[1]
        includeFile = await search.byInclude( {
          file: includeFile, root, include
        } )

        line = await loadFile( includeFile )
      }

      return line
    } )

    return lines
  }




  function find() {

  }
}
