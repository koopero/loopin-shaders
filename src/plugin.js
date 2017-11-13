module.exports = loopinShaders

const _ = require('lodash')
    , config = require('./config')
    , search = require('./search')
    , load = require('./load')
    , H = require('horten')
    , Promise = require('bluebird')
    , pathlib = require('path')

const moduleShaderDir = pathlib.resolve( __dirname, '..', 'shader' )

function loopinShaders( {
  dir = 'shader/'
}) {
  const loopin = this

  loopin.plugin('read')
  loopin.plugin('files')

  let root = loopin.filesAbsolute( dir )

  loopin.shaderVersion = shaderVersion
  loopin.dispatchListen( 'shaderInit', onShaderInit )





  var _shaderVersion
  function shaderVersion() {
    if ( _shaderVersion )
      return _shaderVersion

    _shaderVersion = loopin.read( 'info' )
    .then( info => config.infoToShaderVersion( info ) )

    return _shaderVersion
  }

  function onShaderInit( event ) {
    let key = event.path.split('/')[1]

    if ( key ) {
      shaderLoad( { name: key } )
    }
  }

  async function shaderLoad( { name } ) {
    console.log( root, name )
    let version = await shaderVersion()
    let shader = await search.byName( {
      root, version, name
    })

    shader = _.mapValues( shader, ( element, type ) => {
      if ( element.file )
        return load( {
          file: element.file,
          type,
          version,
          root,
          include: [ moduleShaderDir ]
        } )
    })

    shader = await Promise.props( shader )

    let patch = _.mapValues( shader, element => _.pick( element, ['data'] ) )

    loopin.patch( patch, 'shader/'+name )

    console.log( shader )

  }

}
