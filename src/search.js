const search = exports

const pathlib = require('path')
    , fs = require('fs-extra')


search.byName = async function byName( {
  name,
  root,
  types = ['vert','frag'],
  version = 'gl'
} ) {
  const resolveRoot = pathlib.resolve.bind( pathlib, root || process.cwd() )

  let result = {}
  for ( let i in types ) {
    let type = types[i]
    result[type] = await searchType( type )
  }
  return result

  async function searchType( type ) {
    let exts = extensions( type, version )
    let files = exts
      .map( ext => `${name}${ext}` )
      .map( name => resolveRoot( name ) )

    for ( let i in files ) {
      let file = files[i]
      if ( await checkFile( file ) )
        return {
          file
        }
    }
  }


}

search.byInclude = async function byInclude( {
  file,
  root,
  include,
} ) {
  root = root || process.cwd()
  include = include.map( ( inc ) => pathlib.resolve( root, inc ) )

  if ( include.indexOf( root ) == -1 )
    include.push( root )

  for ( let index in include ) {
    let tryFile = pathlib.resolve( include[index], file )

    if ( await checkFile( tryFile ) )
      return tryFile
  }
}

function extensions( type, version ) {
  return [
    `.${version}.${type}`,
    `.${type}`,
    `.glsl`,
  ]
}

async function checkFile( file ) {
  return fs.exists( file )
}
