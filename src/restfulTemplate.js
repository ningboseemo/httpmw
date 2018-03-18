/**
 * Created by huangxinxin on 17/11/3.
 */
const _ = require('lodash')
const utils = require('./utils')
const $urls = require('./urls')
const $schemas = require('./schemas')
const $trans = require('./trans')

const ARR_SCHEMA = (dataSchema) => {
  return Object.assign({
    items: {
      type: 'object',
      properties: {
        data: dataSchema,
        methods: utils.ARR
      }
    }
  }, utils.ARR)
}

const schema = {
  type: 'object',
  properties: {
    name: utils.STR_NOT_EMPTY,
    url: utils.STR_NOT_EMPTY,
    methods: {
      type: 'array',
      default: [ 'get', 'post', 'put', 'delete' ]
    },
    urlExpired: ARR_SCHEMA($urls.schema.properties.expired),
    urlSchemas: ARR_SCHEMA($urls.schema.properties.schema),
    trans: $trans.arrSchema,
    schemas: utils.ARR
  },
  required: [ 'name', 'url' ]
}

module.exports = (opts) => {
  const valid = utils.ajv.validate(schema, opts)
  if (!valid) {
    throw utils.error(`restfulTemplate: opts格式错误"${utils.ajv.errorsText()}"`)
  }
  const { name, url, methods, urlExpired, urlSchemas, schemas, trans } = opts
  const urlExpiredDict = utils.dmArrToDict(urlExpired)
  const urlSchemasDict = utils.dmArrToDict(urlSchemas)
  const dict = {}
  const urls = methods.map((method) => {
    const id = `${method}${_.capitalize(name)}`
    dict[ method ] = id
    const expired = urlExpiredDict[ method ]
    const schema = urlSchemasDict[ method ]
    const urlItem = { id, method, url }
    if (expired) urlItem.expired = expired
    if (schema) urlItem.schema = schema
    return urlItem
  })
  $urls.set(urls)
  $schemas.set(schemas)
  $trans.set(trans)
  return { name, url, methods: dict }
}
