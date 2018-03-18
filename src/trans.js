/**
 * Created by huangxinxin on 17/9/7.
 */
/**
 * id         必须唯一
 * urlId      数据来源url id
 * processor  处理函数
 */
// 注意事项：
// 1、一个urlId可以对应多个处理器
// 2、当一个urlId有多个处理器时，确保不要直接对res进行修改，而是通过res生成新的结果
const utils = require('./utils')
const MapClass = require('./MapClass')

const schema = {
  type: 'object',
  properties: {
    id: utils.STR,
    urlId: utils.STR
  },
  required: [ 'id', 'urlId' ]
}

const arrSchema = Object.assign({ items: schema }, utils.ARR)

class Trans extends MapClass {
  constructor () {
    super()
    this.schema = schema
    this.arrSchema = arrSchema
  }

  add (opts) {
    const id = opts.id
    if (!id) {
      throw utils.error(`TRANS[ADD]: id="${id}"不合法`)
    }
    if (this.store.has(id)) {
      throw utils.error(`TRANS[ADD]: id="${id}"已存在`)
    }
    const valid = utils.ajv.validate(schema, opts)
    if (!valid) {
      throw utils.error(`TRANS[ADD]: opts格式错误"${utils.ajv.errorsText()}"`)
    }
    if (!(opts.processor instanceof Function)) {
      throw utils.error('TRANS[ADD]: callback不是一个function')
    }
    opts.callback = (response) => {
      return (resolve, reject) => {
        return opts.processor(response, resolve, reject)
      }
    }
    this.store.set(id, opts)
    return this.store.size
  }

  set (arr) {
    const valid = utils.ajv.validate(arrSchema, arr)
    if (!valid) {
      throw utils.error(`TRANS[SET]: 参数格式错误"${utils.ajv.errorsText()}"`)
    }
    arr.forEach(this.add.bind(this))
    return this.store.size
  }
}

module.exports = new Trans()
