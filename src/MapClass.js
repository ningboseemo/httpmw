/**
 * Created by huangxinxin on 17/9/27.
 */
class MapClass {
  constructor () {
    this.store = new Map()
  }

  has (...args) {
    return this.store.has(...args)
  }

  get (...args) {
    return this.store.get(...args)
  }

  delete (...args) {
    return this.store.delete(...args)
  }

  clear () {
    return this.store.clear()
  }

  getAll () {
    return [ ...this.store.values() ]
  }

  get size () {
    return this.store.size
  }
}

module.exports = MapClass
