const _ = require('lodash')
    , assert = require('chai').assert
    , pathlib = require('path')
    , resolveData = pathlib.resolve.bind( pathlib, __dirname, 'data' )
    , root = resolveData()
