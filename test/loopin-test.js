const _ = require('lodash')
    , Loopin = require('loopin')
    , assert = require('chai').assert
    , pathlib = require('path')
    , resolveData = pathlib.resolve.bind( pathlib, __dirname, 'data' )

describe('in loopin', () => {
  var loopin
  beforeEach( () => {
    loopin = require('loopin')()
    loopin.plugin('files')
    loopin.logShow('patch')
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
    loopin.dispatchListen( 'need', ( event ) => {
      assert.equal( event.path, 'shader/dazzle/')
      if ( !calls ) {
        setTimeout( cb, 1000 )
        calls ++
        return true
      }

      assert.fail( 1, calls, 'event called too many times' )

    })
  })

  xit( 'will load a shader', async () => {
    let shader = 'dazzle'

    loopin.patch( shader, 'render/test/shader' )
    loopin.patch( 'test', 'show/buffer' )
    let event = await loopin.dispatchListen(`shader/${shader}/`)
    assert.equal( event.type, 'need' )

    event = await loopin.dispatchListen(`shader/${shader}/`)
    assert.equal( event.type, 'done' )
  })

  it( 'will load a shader from a patch', async ( ) => {
    let path = 'shader/test/'
    loopin.patch( { vert: 'trivial.glsl' }, path  )
    let event = await loopin.dispatchListen(`done::${path}`)
    assert.equal( event.type, 'done' )


    let status = await loopin.read( path )
    assert.deepEqual( status, {

    })

  })

  afterEach( () => {
    return loopin.close()
  })

})
