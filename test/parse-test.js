const _ = require('lodash')
    , assert = require('chai').assert


describe( 'parse', () => {
  const parse = require('../src/parse')
  it('will pass valid data as is', () => {
    let data = {
      vert: {
        name: 'foo'
      }
    }

    let result = parse( data )
    assert.deepEqual( result, data )
  })

  it('will recognize data', () => {
    let data = "#version 150\nmain () {}"
    let result = parse( { frag: data } )
    assert.deepEqual( result, { frag: { data: data } } )
  })

  it('will recognize file', () => {
    let data = "foo.glsl"
    let result = parse( { frag: data } )
    assert.deepEqual( result, { frag: { file: data } } )
  })

})
