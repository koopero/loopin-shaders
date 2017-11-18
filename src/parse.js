module.exports = parse
const _ = require('lodash')
    , config = require('./config')

const isData = str =>
  str.includes('\n')

const isFilename = str =>
  str.includes('.')

function parse( data ) {


  if ( !_.isObject( data ) ) {
    let ob = {}
    config.types.map( ( type ) => ob[type] = data )
    data = ob
  }

  let shader = {}

  config.types.map( function eachType( type ) {
    let value = _.isObject( data ) ? data[type] : data

    if ( !value )
      return

    if ( _.isObject( value ) ) {
      for ( let key of ['data','file','name'] ) {
        if ( key in value ) {
          shader[type] = _.pick( value, key )
          return
        }
      }
    }

    if ( _.isString( value ) ) {
      if ( isData( value ) )
        shader[type] = { data: value }
      else if ( isFilename( value ) )
        shader[type] = { file: value }
      else
        shader[type] = { name: value }
    }
  } )

  return shader
}
