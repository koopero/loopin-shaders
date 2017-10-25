module.exports = load

const _ = require('lodash')
    , fs = require('fs-extra')
    , os = require('os')
    , pathlib = require('path')
    , Promise = require('bluebird')
    , search = require('./search')

async function load( {
  data,
  file,
  root,
  include
} ) {
  root = root || process.cwd()

  if ( !Array.isArray( include ) ) {
    include = [ include ]
  }

  if ( file ) {
    include = [ pathlib.dirname( file ) ].concat( include )
  }

  include = include.filter( ( inc ) => !!inc )

  var loadingFiles = {}
  var error
  var lines

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



  return {
    root,
    file,
    error,
    data
  }

  async function loadFile( file ) {
    if ( loadingFiles[file] )
      return ''

    loadingFiles[file] = true

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
