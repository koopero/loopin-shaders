const _ = require('lodash')
    , assert = require('chai').assert
    , pathlib = require('path')
    , resolveData = pathlib.resolve.bind( pathlib, __dirname, 'data' )
    , root = resolveData()

describe('load', () => {
  const load = require('../src/load')
  it(`doesn't smoke`, async () => {
    var result = await load( {
      root,
      file: resolveData('trivial.glsl'),
    })

    assert.equal( _.trim(result.data), "// hello" )
    assert.equal( result.file, 'trivial.glsl' )
  })

  it(`loads includes`, async () => {
    var result = await load( {
      file: resolveData('include.glsl'),
      root
    })

    assert.equal( _.trim( result.data ), "// hello" )
  })

  it(`loads from data`, async () => {
    var result = await load( {
      data: '#include "trivial.glsl"',
      root,
    })

    assert.equal( _.trim( result.data ), "// hello" )
  })

  xit(`fails properly`, async () => {
    var result = await load( {
      file: 'nope',
      root,
    })
  })

  it('does circularity', async () => {
    let result = await load( {
      file: 'circular/a.glsl',
      root
    })

    let str = result.data.replace(/[^\d]/g,'')

    assert.equal( str, '123456789' )
  })

  it(`loads data with included dir`, async () => {
    var result = await load( {
      data: '#include "subdir/foo.glsl"',
      root,
      include: resolveData('inc/')
    })

    assert.equal( _.trim( result.data ), "// bar" )
  })
})
