/**
 * Created by huangxinxin on 17/9/7.
 */
/**
 * id      必须唯一
 * url     url
 * method  http方法
 * expired 过期时间, s表示秒 m表示分钟, h表示小时, d表示天, w表示周, M表示月, Y表示年
 * schema  检验schema
 *  request
 *    params  请求参数校验的id (query string)
 *    data    请求数据校验的id (post put data)
 *  response  响应数据检验的id
 */
const _ = require('lodash')
const utils = require('./utils')
const MapClass = require('./MapClass')

const schema = {
  type: 'object',
  properties: {
    id: utils.STR_NOT_EMPTY,
    url: utils.STR_NOT_EMPTY,
    method: Object.assign({ enum: [ 'get', 'post', 'put', 'delete' ], default: 'get' }, utils.STR),
    expired: {
      type: 'object',
      properties: {
        s: utils.P_NUM,
        m: utils.P_NUM,
        h: utils.P_NUM,
        d: utils.P_NUM,
        M: utils.P_NUM,
        y: utils.P_NUM
      }
    },
    schema: {
      type: 'object',
      properties: {
        request: {
          type: 'object',
          properties: {
            params: utils.STR,
            data: utils.STR
          }
        },
        response: utils.STR
      }
    }
  },
  required: [ 'id', 'method', 'url' ]
}

const arrSchema = Object.assign({ items: schema }, utils.ARR)

class Urls extends MapClass {
  constructor () {
    super()
    this.schema = schema
    this.arrSchema = arrSchema
  }

  add (opts) {
    const id = opts.id
    const url = opts.url
    if (!id) {
      throw utils.error(`URL[ADD]: id="${id}"不合法`)
    }
    if (!url) {
      throw utils.error(`URL[ADD]: url="${url}"不合法`)
    }
    if (this.store.has(id)) {
      throw utils.error(`URL[ADD]: id="${id}"已存在`)
    }
    const valid = utils.ajv.validate(schema, opts)
    if (!valid) {
      throw utils.error(`URL[ADD]: opts格式错误"${utils.ajv.errorsText()}"`)
    }
    opts.curl = _.template(opts.url)
    opts.expiredMs = utils.expiredToMs(opts.expired)
    this.store.set(id, opts)
    return this.store.size
  }

  set (arr) {
    const valid = utils.ajv.validate(arrSchema, arr)
    if (!valid) {
      throw utils.error(`URL[SET]: 参数格式错误"${utils.ajv.errorsText()}"`)
    }
    arr.forEach(this.add.bind(this))
    return this.store.size
  }

  get allExpiredMs () {
    return this.getAll().map(({ expiredMs }) => expiredMs).filter((d) => d)
  }

  get minExpiredMs () {
    if (this.allExpiredMs.length) {
      return Math.min(...this.allExpiredMs)
    }
    return 0
  }

  get maxExpiredMs () {
    if (this.allExpiredMs.length) {
      return Math.max(...this.allExpiredMs)
    }
    return 0
  }
}

module.exports = new Urls()
