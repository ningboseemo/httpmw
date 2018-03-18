/**
 * Created by huangxinxin on 17/8/30.
 */
const Promise = require('bluebird')
const config = require('./config')
const http = require('./http')
const schemas = require('./schemas')
const trans = require('./trans')
const urls = require('./urls')
const utils = require('./utils')
const restfulTemplate = require('./restfulTemplate')

let handler = null

/**
 * 获取服务端数据
 * @param id          url id
 * @param urlParams   url参数
 * @param config      axios配置项
 * @returns {*}
 */
const request = (id, { urlParams = {}, config = {} } = {}) => {
  const opts = urls.get(id)
  if (opts) {
    let url = ''
    try {
      url = opts.curl(urlParams)
    } catch (err) {
      return Promise.reject(err)
    }
    return http.request(url, opts, config)
  } else {
    return Promise.reject(utils.error(`没有找到"${id}"URL配置`))
  }
}

/**
 * 获取处理后的数据
 * @param id      处理器id
 * @param args    request方法去掉'id'的其它参数
 * @returns {*}
 */
const transform = (id, ...args) => {
  const opts = trans.get(id)
  if (opts) {
    return request(opts.urlId, ...args).then((res) => new Promise(opts.callback(res)))
  }
  return Promise.reject(utils.error(`没有找到"${id}"TRANS配置`))
}

/**
 * 开启定时清除过期的缓存轮询
 * @param cb 回调函数
 */
const startClearExpired = (cb) => {
  const interval = urls.minExpiredMs
  if (interval && http.requests.size) {
    handler = setInterval(() => {
      const size = http.clearExpired()
      if (cb instanceof Function) {
        cb(size)
      }
      if (!size) {
        clearInterval(handler)
      }
    }, interval)
    return handler
  }
  return null
}

/**
 * 停止定时清除过期的缓存轮询
 */
const stopClearExpired = () => {
  clearInterval(handler)
}

/**
 * 定义rest模型，参数参考restfulTemplate schema
 * @param args
 * @returns {{}}
 */
const restDefine = (...args) => {
  const { name, url, methods } = restfulTemplate(...args)
  const apis = { name, url }
  for (let method in methods) {
    const id = methods[ method ]
    apis[ method ] = (...args) => request(id, ...args)
  }
  return apis
}

module.exports = {
  request,
  transform,
  startClearExpired,
  stopClearExpired,
  schemas,
  trans,
  urls,
  restDefine,
  get networks () {
    return { size: http.networks.size, details: [ ...http.networks.keys() ] }
  },
  get requests () {
    return {
      size: http.requests.size,
      promises: [ ...http.requests.values() ].map(({ queue }) => queue.length).reduce((s, a) => s + a, 0),
      contexts: [ ...http.requests.values() ]
    }
  },
  getRequestContext (id) {
    return http.requests.get(id)
  },
  setConfig (opts) {
    if (opts instanceof Object && Object.keys(opts).length) {
      Object.assign(config, opts)
      return true
    }
    return false
  }
}
