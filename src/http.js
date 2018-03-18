/**
 * Created by zhangxuemei on 17/5/08.
 */
const axios = require('axios')
const Promise = require('bluebird')
const md5 = require('blueimp-md5')
const utils = require('./utils')

const getRequestId = ({ expiredMs }, config) => {
  if (!expiredMs) {
    config.noExpiredRandom = Math.random() * Math.random()
  }
  config.REQ_ID = md5(JSON.stringify(config))
  return config.REQ_ID
}

class Http {
  constructor () {
    this.networks = new Map()
    this.requests = new Map()
  }

  clearExpired () {
    [ ...this.requests.values() ].forEach((item) => {
      let isExpired = this.hasExpired(item)
      if (isExpired) {
        this.requests.delete(item.id)
      }
    })
    return this.requests.size
  }

  hasExpired (item) {
    const now = +new Date()
    return (now - item.time) >= item.options.expiredMs && !item.queue.length
  }

  request (url, options, config) {
    if (options.schema && options.schema.request) {
      const paramsSchema = options.schema.request.params
      const dataSchema = options.schema.request.data
      if (paramsSchema) {
        const valid = utils.ajv.validate(paramsSchema, config.params)
        if (!valid) {
          return Promise.reject(utils.error(`HTTP[REQUEST][${options.id}]: params格式错误"${utils.ajv.errorsText()}"`))
        }
      }
      if (dataSchema) {
        const valid = utils.ajv.validate(dataSchema, config.data)
        if (!valid) {
          return Promise.reject(utils.error(`HTTP[REQUEST][${options.id}]: data格式错误"${utils.ajv.errorsText()}"`))
        }
      }
    }
    config.url = url
    config.method = options.method
    const id = getRequestId(options, config)
    return this.fetch(id, options, config, () => axios.request(config))
  }

  fetch (id, options, config, cb) {
    let canRequest = true
    if (this.requests.has(id)) {
      const item = this.requests.get(id)
      const isExpired = this.hasExpired(item)
      if (isExpired) { // 过期了
        this.requests.delete(id)
        this.create(id, options, config)
      } else {
        canRequest = false
      }
    } else {
      this.create(id, options, config)
    }
    if (canRequest) {
      this.networks.set(id, true)
    }
    return new Promise((resolve, reject) => {
      const item = this.requests.get(id)
      this.append(id, resolve, reject)
      if (canRequest) { // 发起请求
        utils.info(`${config.REQ_ID}发起请求`)
        cb().then(this.success(id).bind(this)).catch(this.error(id).bind(this))
      } else if (item.done) { // 直接返回缓存
        if (item.response) {
          this.success(id)(item.response)
        } else {
          this.error(id)(item.error)
        }
      }
    })
  }

  create (id, options, config) {
    const time = +new Date()
    this.requests.set(id, {
      id,
      time,
      options,
      config,
      queue: [],
      response: null,
      error: null,
      get done () {
        return !!(this.response || this.error)
      }
    })
    return this
  }

  append (id, resolve, reject) {
    const item = this.requests.get(id)
    if (item) item.queue.push({ resolve, reject })
    return this
  }

  success (id) {
    return (res) => {
      this.networks.delete(id)
      const item = this.requests.get(id)
      if (!item) return
      const options = item.options
      const data = res.data
      let ajvError = null
      if (options.schema && options.schema.response) {
        const valid = utils.ajv.validate(options.schema.response, data)
        if (!valid) {
          ajvError = utils.error(`HTTP[RESPONSE][${options.id}]: 格式错误"${utils.ajv.errorsText()}"`)
          ajvError.response = res
        }
      }
      let q = item.queue.shift()
      item.response = res
      while (q) {
        if (ajvError) {
          q.reject(ajvError)
        } else {
          q.resolve(res)
        }
        q = item.queue.shift()
      }
      this.done(id)
    }
  }

  error (id) {
    return (err) => {
      this.networks.delete(id)
      const item = this.requests.get(id)
      if (!item) return
      let q = item.queue.shift()
      item.error = err
      while (q) {
        q.reject(err)
        q = item.queue.shift()
      }
      this.done(id)
    }
  }

  done (id) {
    const item = this.requests.get(id)
    if (item) {
      const config = item.config
      utils.info(`${config.REQ_ID} ${item.error ? 'Error' : 'Success'}`)
    }
    this.clearExpired()
    return this
  }
}

module.exports = new Http()
