/**
 * Created by huangxinxin on 17/9/27.
 */
const utils = require('./utils')
const MapClass = require('./MapClass')

class Schemas extends MapClass {
  add (opts) {
    const id = opts.id
    if (!id) {
      throw utils.error(`SCHEMA[ADD]: id="${id}"不合法`)
    }
    if (this.store.has(id)) {
      throw utils.error(`SCHEMA[ADD]: id="${id}"已存在`)
    }
    utils.ajv.addSchema(opts)
    this.store.set(id, opts)
    return this.store.size
  }

  set (arr) {
    if (arr instanceof Array) {
      arr.forEach(this.add.bind(this))
    } else {
      throw utils.error('SCHEMA[SET]: 参数格式错误')
    }
    return this.store.size
  }
}

module.exports = new Schemas()
