const _ = require('lodash')
    , Loopin = require('loopin')
    , assert = require('chai').assert
    , pathlib = require('path')
    , resolveData = pathlib.resolve.bind( pathlib, __dirname, 'data' )

const fs = require('fs-extra')
async function writeRandomGLSL() {
  let file = resolveData( 'random.glsl' )
  let number = _.random( 1, 8000 ) / 8
  let data = `const float RANDOM = ${number}; // Chosen by fair dice roll`

  await fs.outputFile( file, data )

  return String( number )
}

describe('in loopin', () => {
  var loopin
  beforeEach( () => {
    loopin = Loopin()
    loopin.plugin('files')
    loopin.logShow('patch')
    loopin.filesRoot( resolveData() )
    loopin.plugin( require('../src/plugin.js'), {
      dir: '.'
    } )

    loopin.plugin( require('loopin-native') )

    return loopin.bootstrap()
  })

  it( 'will get version', () => {
    let result = loopin.shaderVersion()
    let version = expectedVersion()
    return Promise.resolve( result )
    .then( ( result ) => assert.equal( result, '150' ) )
  })

  it( 'will send event when shader is initialized', ( cb ) => {
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

  it( 'will load a shader', async () => {
    let shader = 'dazzle'

    loopin.patch( shader, 'render/test/shader' )
    loopin.patch( 'test', 'show/buffer' )
    let event = await loopin.dispatchListen(`shader/${shader}/`)
    assert.equal( event.type, 'need' )

    event = await loopin.dispatchListen(`shader/${shader}/`)
    assert.equal( event.type, 'done' )
  })

  it( 'will load a shader from a patch', async () => {
    let path = 'shader/test/'
      , file = 'trivial.glsl'
      , text = '// hello'

    loopin.patch( { vert: file }, path  )


    let event = await loopin.dispatchListen(`done::${path}`)
    assert.equal( event.type, 'done' )


    let status = await loopin.read( path )
    assert( status.vert.data.includes( text ))
  })

  it( 'will load a shader from a patched name', async () => {
    let path = 'shader/test/'
      , name = 'dazzle'
      , text = '// keyword dazzle'


    loopin.patch( { vert: name }, path  )


    let event = await loopin.dispatchListen(`done::${path}`)
    assert.equal( event.type, 'done' )


    let status = await loopin.read( path )
    assert( status.vert.data.includes( text ))
  })


  it( 'will watch file from patch', async () => {
    let path = 'shader/test/'
      , name = 'random'

    await writeRandomGLSL()


    loopin.patch( { vert: name }, path  )
    await loopin.dispatchListen(`done::${path}`)

    // arbitrary cooldown
    await loopin.Promise.delay( 400 )

    let text = await writeRandomGLSL()
    await loopin.dispatchListen(`done::${path}`)


    let status = await loopin.read( path )
    assert( status.vert.data.includes( text ))

  })


  afterEach( () => {
    return loopin.close()
  })

})

function expectedVersion() {
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
