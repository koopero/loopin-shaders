const _ = require('lodash')
    , search = require('./search')
    , load = require('./load')
    , config = require('./config')
    , Promise = require('bluebird')
    , pathlib = require('path')
    , fs = require('fs')


const EventEmitter = require('events')

class Shader extends EventEmitter {
  constructor( { name, root, loopin, include, debounce } ) {
    super()


    Object.defineProperty( this, 'name', {
      value: name,
      enumerable: true
    })
    Object.defineProperty( this, 'root', {
      value: root,
      enumerable: true
    })
    Object.defineProperty( this, 'loopin', {
      value: loopin,
      enumerable: false
    })
    Object.defineProperty( this, 'include', {
      value: include,
      enumerable: true
    })
    debounce = parseInt( debounce ) || 250
    this._onWatch = _.debounce( this.onWatch.bind( this ), debounce )
  }

  async load() {
    this.unwatch()
    let { name, root, loopin, include, version } = this
    let shader = await search.byName( {
      root, version, name
    })
    console.log( shader )

    shader = _.mapValues( shader, ( element, type ) => {
      if ( element && element.file )
        return load( {
          file: element.file,
          type,
          version,
          root,
          include
        } )
    })

    shader = await Promise.props( shader )
    _.extend( this, shader )

    let patch = _.mapValues( shader, element => _.pick( element, ['data'] ) )

    loopin.patch( patch, 'shader/'+name )
  }

  watch() {
    let { root } = this

    this.unwatch()
    let files = _.map( _.pick( this, config.types ), ( element ) => element.watch )
    files = _.flatten( files )
    files = _.filter( files )
    files = _.map( files, file => pathlib.resolve( root, file ) )
    files = _.uniq( files )
    this._watchers = _.map( files,
      file => fs.watch( file, { persistent: false }, this._onWatch )
    )

    // console.log( 'watching', files )

  }

  onWatch( event ) {
    // console.log( 'onWatch', arguments )
    this.load()
  }

  unwatch() {
    this._onWatch.cancel()
    _.map( this._watchers, ( watcher ) => watcher.close() )
    this._watchers = []
  }


}

module.exports = Shader
