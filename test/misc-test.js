const _ = require('lodash')
    , assert = require('chai').assert
    , pathlib = require('path')
    , resolveData = pathlib.resolve.bind( pathlib, __dirname, 'data' )
    , root = resolveData()

describe('search', () => {
  const search = require('../src/search')

  describe('byName', () => {
    it(`doesn't smoke`, async () => {
      const result = await search.byName( {
        root,
        name: 'dazzle'
      })
      assert.equal( result.vert.file, resolveData('dazzle.glsl') )
    })


    it(`gets es`, async () => {
      const result = await search.byName( {
        root,
        name: 'dazzle',
        version: 'es'
      })

      assert.equal( result.vert.file, resolveData('dazzle.es.vert') )
    })
  })
})

describe('extensions', () => {
  const extensions = require('../src/config').extensions
  it('will not smoke', async () => {
    let result = extensions( {
      type: 'vert',
      version: '150'
    })

    assert.deepEqual( result, [ '.150.vert', '.vert', '.150.glsl', '.glsl' ] )

  })
})

describe('preload', () => {
  const preload = require('../src/preload')
  it('will not smoke', async () => {
    let result = await preload( {
      root,
      version: '150'
    })

    console.log( result )

  })
})
