module.exports = preload

const _ = require('lodash')
    , pathlib = require('path')
    , fs = require('fs-extra')
    , config = require('./config')


async function preload( {
  root,
  version
}) {

  version = await version

  let extensions = config.extensions( { version } )
  let listing = await loadDir( { root, extensions } )
  let files = listing.filter( item => !!item.file )
  let names = _.uniqBy( files, 'name' )

  return names
}

async function loadDir( { dir = '.', root, extensions } ) {
  dir = pathlib.resolve( root, dir )
  let listing = await fs.readdir( dir )
  listing = await Promise.all( listing.map(
    async ( item ) => {
      let path = pathlib.resolve( dir, item )
      let stat = await fs.stat( path )
      if ( stat.isDirectory() )
        return {
          dir: pathlib.relative( root, path )
        }

      let name = item.split('.')[0]

      if ( extensions && !_.find( extensions, ( ext ) => item == name + ext ) )
        return

      return {
        name,
        file: pathlib.relative( root, path )
      }
    }
  ))

  listing = _.filter( listing )

  return listing
}
