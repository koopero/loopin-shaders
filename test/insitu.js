const Loopin = require('loopin')
    , assert = require('chai').assert
    , pathlib = require('path')
    , resolveData = pathlib.resolve.bind( pathlib, __dirname, 'data' )

describe('in loopin', () => {
  var loopin
  beforeEach( () => {
    loopin = require('loopin')()
    loopin.plugin('files')
    loopin.filesRoot( resolveData() )
    loopin.plugin( require('../src/plugin.js'), {
      dir: '.'
    } )

    loopin.plugin( require('loopin-native') )

    return loopin.bootstrap()
  })

  xit( 'will get version', () => {
    let result = loopin.shaderVersion()
    return Promise.resolve( result )
    .then( ( result ) => assert.equal( result, '150' ) )
  })

  xit( 'will send event when shader is initialized', ( cb ) => {
    loopin.patch( 'dazzle', 'render/foo/shader' )

    let calls = 0
    loopin.dispatchListen( 'shaderInit', ( event ) => {
      assert.equal( event.path, 'shader/dazzle/')
      if ( !calls ) {
        setTimeout( cb, 1000 )
        calls ++
        return true
      }

      assert.fail( 1, calls, 'event called too many times' )

    })
  })

  it( 'will load a shader', ( cb ) => {
    loopin.patch( 'dazzle', 'render/test/shader' )
    loopin.patch( 'test', 'show/buffer' )
  })

  afterEach( () => {
    return loopin.close()
  })

})
