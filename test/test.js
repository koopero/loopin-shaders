const _ = require('lodash')
    , assert = require('chai').assert
    , pathlib = require('path')
    , resolveData = pathlib.resolve.bind( pathlib, __dirname, 'data' )


describe('loopin-shader', () => {
  describe('load', () => {
    const load = require('../src/load')
    it(`doesn't smoke`, async () => {
      var result = await load( {
        root: resolveData(),
        file: resolveData('trivial.glsl'),
      })

      assert.equal( _.trim(result.data), "// hello" )
      assert.equal( result.file, 'trivial.glsl' )
    })

    it(`loads includes`, async () => {
      var result = await load( {
        file: resolveData('include.glsl'),
        root: resolveData()
      })

      assert.equal( _.trim( result.data ), "// hello" )
    })

    it(`loads from data`, async () => {
      var result = await load( {
        data: '#include "trivial.glsl"',
        root: resolveData(),
      })

      assert.equal( _.trim( result.data ), "// hello" )
    })

    xit(`fails properly`, async () => {
      var result = await load( {
        file: 'nope',
        root: resolveData(),
      })

    })

    it(`loads data with included dir`, async () => {
      var result = await load( {
        data: '#include "subdir/foo.glsl"',
        root: resolveData(),
        include: resolveData('inc/')
      })

      assert.equal( _.trim( result.data ), "// bar" )
    })
  })


})


describe('search', () => {
  const search = require('../src/search')

  describe('byName', () => {
    it(`doesn't smoke`, async () => {
      const result = await search.byName( {
        root: resolveData(),
        name: 'dazzle'
      })
      assert.equal( result.vert.file, resolveData('dazzle.glsl') )
    })


    it(`gets es`, async () => {
      const result = await search.byName( {
        root: resolveData(),
        name: 'dazzle',
        version: 'es'
      })

      assert.equal( result.vert.file, resolveData('dazzle.es.vert') )
    })
  })
})
