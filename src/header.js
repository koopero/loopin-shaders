module.exports = header

function header( { data, version, type } ) {

  let header = ''

  if ( version && version != 'es' )
    header += `#version ${version}\n`

  header += `#define SHADER_TYPE_${type.toUpperCase()}\n`

  data = data.replace( /^\#version.*\r?\n/m, '' )

  return header + data
}
