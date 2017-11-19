module.exports = header

function header( { data, version, type } ) {


  let header = ''
  if ( version )
    header += `#version ${version}\n`

  if ( type )
    header += `#define SHADER_TYPE_${type.toUpperCase()} 1\n`

  data = data.replace( /^\#version.*\r?\n/m, '' )




  return header + data
}
