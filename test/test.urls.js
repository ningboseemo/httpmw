/**
 * Created by huangxinxin on 17/9/27.
 */
const assert = require('assert')
const utils = require('./utils')
const httpMW = require('../src/index')

const urls = httpMW.urls

let a = {
  id: 'a',
  url: '/api/a',
  method: 'get'
}

describe('模块: urls', () => {
  it('#add', () => {
    urls.add(a)
    urls.add({
      id: 'b',
      url: '/api/b',
      method: 'post',
      expired: {
        m: 30,
        h: 2
      }, // 9000000
      schema: {
        request: {
          params: 'a',
          data: 'b'
        },
        response: 'c'
      }
    })
    utils.try(
      () => {
        // error
        urls.add({
          id: [],
          url: {},
          method: 'xs',
          expired: {
            s: 'a'
          },
          schema: {
            request: 'a',
            response: []
          }
        })
      },
      () => {
        // exist
        urls.add({
          id: 'a',
          url: '/api/a',
          method: 'get'
        })
      }
    )
    assert.equal(2, urls.size)
  })

  it('#set', () => {
    urls.set([
      {
        id: 'c',
        url: '/api/c',
        method: 'put',
        expired: {
          h: 30,
          d: 2
        } // 280800000
      },
      {
        id: 'd',
        url: '/api/a',
        method: 'delete',
        expired: {
          s: 10,
          m: 30,
          h: 2,
          d: 30,
          M: 5,
          y: 2
        } // 77769010000
      }
    ])
    assert.equal(4, urls.size)
  })

  it('#has', () => {
    assert.equal(true, urls.has('c'))
    assert.equal(false, urls.has('xxx'))
  })

  it('#get', () => {
    assert.equal(a, urls.get('a'))
    assert.equal(undefined, urls.get('xxx'))
  })

  it('#delete', () => {
    urls.delete('c')
    assert.equal(3, urls.size)
  })

  it('#getAll', () => {
    assert.equal(3, urls.getAll().length)
  })

  it('#minExpiredMs', () => {
    assert.equal(9000000, urls.minExpiredMs)
  })

  it('#maxExpiredMs', () => {
    assert.equal(77769010000, urls.maxExpiredMs)
  })

  it('#clear', () => {
    urls.clear()
    assert.equal(0, urls.size)
  })
})
