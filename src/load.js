module.exports = load

const _ = require('lodash')
    , fs = require('fs-extra')
    , os = require('os')
    , pathlib = require('path')
    , Promise = require('bluebird')
    , search = require('./search')
    , header = require('./header')

const debug = ()=>0

async function load( {
  data,
  file,
  name,
  root,
  include,
  version,
  type,
  warn = console.warn
} ) {
  root = root || process.cwd()

  if ( !Array.isArray( include ) ) {
    include = [ include ]
  }

  include = include.filter( ( inc ) => !!inc )

  var error = null
  var lines
  var watch = []

  if ( data )
    lines = await loadData( data )
  else if ( file )
    lines = await loadFile( file )
  else if ( name )
    lines = await loadName( name )
  else if ( warn )
    warn( "No input specified.")

  if ( lines ) {
    data = _.flattenDeep( lines )
  }

  if ( file ) {
    file = pathlib.resolve( root, file )
    file = pathlib.relative( root, file )
  }

  watch = watch.map( ( file ) => pathlib.relative( root, file ) )

  if ( data && _.isArray( data ) )
    data = data.join( os.EOL )

  if ( data ) {
    data = header( { data, version, type } )
  }

  return {
    root,
    file,
    error,
    watch,
    data
  }

  async function loadName( name ) {
    let shader = await search.byName( { name, root, types: [ type ], version } )
    let element = shader[type]

    if ( element && element.file ) {
      file = element.file
      return loadFile( element.file )
    }
  }

  async function loadFile( file ) {
    debug( 'loadFile', file, 'that was the file' )
    if ( !include.includes( pathlib.dirname( file ) ) )
      include = [ pathlib.dirname( file ) ].concat( include )

    file = pathlib.resolve( root, file )

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
      if ( match = /^\#include [\'\"](.*?)[\'\"]/.exec( line ) ) {
        let query = match[1]
        let includeFile = await search.byInclude( {
          file: query, root, include: include.concat( alsoInclude )
        } )

        debug('loadData', query, includeFile, include )

        if ( includeFile )
          line = await loadFile( includeFile )
        else
          line = null
      }

      return line
    } )

    return lines
  }




  function find() {

  }
}
