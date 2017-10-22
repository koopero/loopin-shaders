module.exports = load

const fs = require('fs-extra')

async function load( {
  file,
} ) {

  let data = await fs.readFile( file, 'utf8' )


  return {
    file,
    data
  }

  function find() {

  }
}
