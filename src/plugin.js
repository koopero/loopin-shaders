module.exports = loopinShaders

const _ = require('lodash')
    , config = require('./config')
    , Shader = require('./shader')
    , H = require('horten')
    , Promise = require('bluebird')
    , pathlib = require('path')


const debug = ()=>0
const moduleShaderDir = pathlib.resolve( __dirname, '..', 'shader' )

function loopinShaders( {
  dir = 'shader/',
  watch = true
} = {} ) {
  const loopin = this
      , Promise = loopin.Promise
      , shaders = {}

  loopin.plugin('read')
  loopin.plugin('files')

  let root = loopin.filesAbsolute( dir )
  let include = [ root, moduleShaderDir ]

  loopin.shader = shader
  loopin.shaderVersion = shaderVersion
  loopin.shaderInclude = include
  loopin.shadersIncludeDir = shadersIncludeDir

  loopin.dispatchListen( 'need', onNeed )
  loopin.hookAdd('patchMutate', hookPatchMutate )
  loopin.hookAdd('close', onClose )

  function shader( name, delta ) {
    if ( !shaders[name] )
      shaders[name] = new Shader( { loopin, root, include, name } )

    if ( delta )
      shaders[name].patch( delta )

    return shaders[name]
  }

  function shadersIncludeDir( dir ) {
    dir = loopin.filesAbsolute( dir )
    console.log( { INKLUDE: dir } )
    include.push( dir )
  }


  async function hookPatchMutate( mutant ) {
    let path = 'shader/'
      , delta = mutant.get( path )

    if ( !delta )  return

    data = _.mapValues( delta, async function ( delta, name ) {
      let shader = loopin.shader( name )
        , result = await shader.patchData( delta )
      debug( 'hookPatchMutate', name, delta, result )

      if ( watch )
        shader.watch()
      else
        shader.unwatch()

      return result
    } )
    data = await Promise.props( data )

    mutant.set( data, path )
  }



  var _shaderVersion
  function shaderVersion() {
    if ( _shaderVersion )
      return _shaderVersion

    _shaderVersion = loopin.read( 'info' )
    .then( info => config.infoToShaderVersion( info ) )

    return _shaderVersion
  }

  async function onNeed( event ) {
    let base = event.path.split('/')[0]
    if ( base == 'shader' )
      return onShaderNeed( event )
  }

  async function onShaderNeed( event ) {
    let key = event.path.split('/')[1]
    let version = await shaderVersion()

    if ( key ) {
      shader( key ).version = version
      shader( key ).load()
      if ( watch )
        shader( key ).watch()
    }
  }

  function onClose() {
    debug('onClose')
    _.map( shaders, shader => shader.unwatch() )
  }
}
