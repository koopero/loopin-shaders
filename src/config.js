const config = exports

const _ = require('lodash')

config.types = ['vert','frag']

config.extensions = function extensions( {
  type,
  version,
  ext = 'glsl',
  types = [ 'vert', 'frag' ]
} ) {

  let result = []

  function oneType( type ) {
    if ( version )
      result.push( `.${version}.${type}` )

    result.push( `.${type}` )
  }

  if ( type )
    oneType( type )
  else if ( types )
    types.map( oneType )

  if ( version )
    result.push( `.${version}.${ext}`)

  result.push( `.${ext}` )

  return result
}



config.infoToShaderVersion = function ( info ) {
  let VersionMajor = _.get( info, 'window.gl.VersionMajor') || 0
  let VersionMinor = _.get( info, 'window.gl.VersionMinor') || 0
  let version = String( VersionMajor ) + String( VersionMinor )

  if ( version.length < 3 )
    version += '0'

  // As per https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)#OpenGL_and_GLSL_versions
  switch ( version ) {
    case '200': version = '110'; break
    case '210': version = '120'; break
    case '300': version = '130'; break
    case '310': version = '140'; break
    case '320': version = '150'; break
  }

  return version
}
