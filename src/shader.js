const _ = require('lodash')
    , search = require('./search')
    , load = require('./load')
    , parse = require('./parse')
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

    debounce = parseInt( debounce ) || 80
    this._onWatch = _.debounce( this.onWatch.bind( this ), debounce )
  }

  async patchData( delta ) {
    let { root, loopin, include } = this
    let version = await loopin.shaderVersion()
    let leftovers = {}

    if ( _.isObject( delta ) ) {
      leftovers = _.pickBy( delta, ( v, k ) => !config.types.includes( k ) )
      delta = _.pick( delta, config.types )
    }
    delta = parse( delta )


    let shader = _.mapValues( delta, async ( element, type ) => {
      if ( config.types.includes( type ) ) {
        console.log( 'load', element )
        let loaded = await load( Object.assign(
          { type, version, root, include },
          element
        ) )
        console.log( 'loaded', loaded )
        return loaded

      }
    } )

    shader = await Promise.props( shader )

    _.extend( this, shader )

    return _.extend( leftovers, _.mapValues( shader, element => _.pick( element, ['data'] ) ) )
  }

  async load() {
    let { loopin, name } = this
    let existing = {}
    config.types.map( type => existing[type] = this[type] || null )

    existing = _.mapValues( existing, ( element, type ) => {
      if ( element && element.file )
        return { file: element.file }

      if ( element && element.data )
        return { data: element.data }

      if ( element && element.name )
        return { name: element.name }

      return { name }
    } )

    console.log( 'load', existing )

    await loopin.patch( existing, `shader/${name}` )
  }

  async patch( delta ) {
    let { loopin, name } = this
    delta = await this.patchData( delta )
    // console.log( 'patch', delta )

    loopin.patch( delta, `shader/${name}` )
  }

  async loadFromFiles() {
    let { loopin, name } = this
    let files = _.mapValues(
      _.pick( this, config.types ),
      ( element, type ) => {
        console.log( element )
        if ( element.file )
          return { file: element.file }
      }
    )

    console.log( 'loadFromFiles', files )

    await loopin.patch( files, `shader/${name}` )
  }

  watch() {
    let { root } = this

    this.unwatch()

    let files = _.map( _.pick( this, config.types ), ( element ) => element && element.watch )
    files = _.flatten( files )
    files = _.filter( files )
    files = _.map( files, file => pathlib.resolve( root, file ) )
    files = _.uniq( files )
    console.log( 'watching', files )

    this._watchers = _.map( files,
      file => fs.watch( file, { persistent: false }, this._onWatch )
    )


  }

  onWatch( event ) {
    console.log( 'onWatch', arguments )
    return this.loadFromFiles()
  }

  unwatch() {
    this._onWatch.cancel()
    _.map( this._watchers, ( watcher ) => watcher && watcher.close() )
    this._watchers = []
  }


}

module.exports = Shader
