module.exports = loopinShaders

const _ = require('lodash')
    , config = require('./config')
    , Shader = require('./shader')
    , H = require('horten')
    , Promise = require('bluebird')
    , pathlib = require('path')

const moduleShaderDir = pathlib.resolve( __dirname, '..', 'shader' )

function loopinShaders( {
  dir = 'shader/',
  watch = true
} = {} ) {
  const loopin = this
      , shaders = {}

  loopin.plugin('read')
  loopin.plugin('files')

  let root = loopin.filesAbsolute( dir )
  let include = [ root, moduleShaderDir ]

  loopin.shaderVersion = shaderVersion
  loopin.dispatchListen( 'shaderInit', onShaderInit )
  loopin.hookAdd('patchMutate', hookPatchMutate )


  function shader( name ) {
    if ( !shaders[name] )
      shaders[name] = new Shader( { name, loopin, root, include } )

    return shaders[name]
  }

  async function hookPatchMutate( mutant ) {
    console.log('hookPatchMutate', mutant.get() )
    await Promise.delay( 3000 )
  }



  var _shaderVersion
  function shaderVersion() {
    if ( _shaderVersion )
      return _shaderVersion

    _shaderVersion = loopin.read( 'info' )
    .then( info => config.infoToShaderVersion( info ) )

    return _shaderVersion
  }

  async function onShaderInit( event ) {
    let key = event.path.split('/')[1]
    let version = await shaderVersion()

    if ( key ) {
      shader( key ).version = version
      shader( key ).load()
      if ( watch )
        shader( key ).watch()
    }
  }
}
