/**
 * Created by huangxinxin on 17/9/27.
 */
const assert = require('assert')
const utils = require('./utils')
const httpMW = require('../src/index')

const schemas = httpMW.schemas

describe('模块: schemas', () => {
  it('#add', function () {
    schemas.add({
      id: 'sa',
      type: 'object',
      properties: {
        name: {
          type: 'string'
        }
      }
    })
    utils.try(
      () => {
        schemas.add()
      },
      () => {
        schemas.add({})
      },
      () => {
        schemas.add({
          id: 'sa'
        })
      }
    )
    assert.equal(1, schemas.size)
  })
})
