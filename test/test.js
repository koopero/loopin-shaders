const test = exports
    , _ = require('lodash')
    , assert = require('chai').assert
    , pathlib = require('path')
    , fs = require('fs-extra')
    , resolveData = pathlib.resolve.bind( pathlib, __dirname, 'data' )
    , root = resolveData()


test.platformVersion = () => {
    let arch = require('os').arch()
    switch ( arch ) {
        case 'arm':
        case 'arm64':
        return 'es'

        case 'x64':
        case 'x86':
        return '150'
    }

    throw new Error(`Test error, arch ${arch} not supported`)
}


test.writeRandomGLSL = async () => {
  let file = resolveData( 'random.glsl' )
  let number = _.random( 1, 8000 ) / 8
  let data = `const float RANDOM = ${number}; // Chosen by fair dice roll\nvoid main() {}`

  await fs.outputFile( file, data )

  return String( number )
}