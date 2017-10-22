const assert = require('chai').assert
    , pathlib = require('path')
    , resolveData = pathlib.resolve.bind( pathlib, __dirname, 'data' )


describe('loopin-shader', () => {
  describe('load', () => {
    it(`doesn't smoke`, async () => {
      const load = require('../src/load')

      var result = await load( {
        file: resolveData('trivial.glsl'),
      })

      assert.equal( result.data, "// hello\n" )
    })
  })
})
