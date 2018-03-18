/**
 * Created by huangxinxin on 17/9/27.
 */
const assert = require('assert')
const utils = require('./utils')
const httpMW = require('../src/index')

const trans = httpMW.trans

describe('模块: trans', () => {
  it('#add', function () {
    trans.add({
      id: 'ta',
      urlId: 'a',
      processor (res, resolve, reject) {}
    })
    utils.try(
      () => {
        trans.add()
      },
      () => {
        trans.add({})
      },
      () => {
        trans.add({
          id: 'ta'
        })
      }
    )
    assert.equal(1, trans.size)
  })
})
