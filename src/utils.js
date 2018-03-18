/**
 * Created by huangxinxin on 17/9/27.
 */
const Ajv = require('ajv')
const config = require('./config')
const pkg = require('../package.json')

const pkgBanner = `${pkg.name}@${pkg.version}`

const unit = { s: 1000 }
unit.m = 60 * unit.s
unit.h = 60 * unit.m
unit.d = 24 * unit.h
unit.M = 30 * unit.d
unit.y = 12 * unit.M

const P_NUM = {
  type: 'number',
  default: 0
}

const STR = {
  type: 'string',
  default: ''
}

const STR_NOT_EMPTY = Object.assign({
  minLength: 1
}, STR)

const ARR = {
  type: 'array',
  default: []
}

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,
  coerceTypes: true,
  v5: true,
  mergeDefaults: true,
  $data: true
})

const info = (...args) => {
  if (config.debug) {
    console.log(`${pkgBanner} in debug mode`, ...args)
  }
}

const error = (msg) => {
  const err = new Error(`${pkgBanner}: ${msg}`)
  if (config.debug) {
    console.error(`${pkgBanner} in debug mode`, err)
  }
  return err
}

const expiredToMs = (obj) => {
  let ts = 0
  for (let k in obj) {
    ts += obj[ k ] * (unit[ k ] || 0)
  }
  return ts
}

/**
 * @param arr: [ { data, methods }, ... ] => { method: data }
 *        methods: [ 'get', ... ]
 */
const dmArrToDict = (arr) => {
  const dict = {}
  arr.forEach(({ data, methods }) => {
    methods.forEach((method) => {
      dict[ method ] = data
    })
  })
  return dict
}

module.exports = { P_NUM, STR, STR_NOT_EMPTY, ARR, ajv, info, error, expiredToMs, dmArrToDict }
