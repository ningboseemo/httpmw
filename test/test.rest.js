/**
 * Created by huangxinxin on 17/11/3.
 */
const assert = require('assert')
const Promise = require('bluebird')
const utils = require('./utils')
const httpMW = require('../src/index')

const restDefine = httpMW.restDefine

const tpl1 = {
  name: 'user',
  url: 'http://10.95.38.32:5200/mock/5a17c04697eeb74c9be1e995/example/query/<%= id %>'
}

const tpl2 = {
  name: 'group',
  url: '/api/user',
  methods: [ 'get', 'post' ],
  urlExpired: [ {
    data: {
      s: 10,
      m: 30,
      h: 2,
      d: 30,
      M: 5,
      y: 2
    },
    methods: [ 'get' ]
  } ],
  urlSchemas: [ {
    data: {
      request: {
        params: 'a',
        data: 'b'
      },
      response: 'c'
    },
    methods: [ 'post' ]
  } ],
  schemas: [ {
    id: 'a',
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  }, {
    id: 'b',
    type: 'array'
  }, {
    id: 'c',
    type: 'array'
  } ],
  trans: [ {
    id: 'tass',
    urlId: 'a',
    processor (res, resolve, reject) {}
  } ]
}

const tplErr = {
  name: 123,
  url: '',
  methods: [ 'a', 'b' ],
  urlExpired: {},
  urlSchemas: {},
  schemas: {},
  trans: {}
}

describe('模块: restDefine', () => {
  it('#tpl1', function (done) {
    this.timeout(60 * 1000)
    const model = restDefine(tpl1)
    const urlParams = { id: ~~(Math.random() * 100) }
    const asyncs = [
      model.get({ urlParams, config: { params: { name: 'yesyt' } } }),
      model.put({ urlParams, config: { params: { name: 'yesyt' }, data: { pwd: '123456' } } }),
      model.post({ urlParams, config: { data: { pwd: '123456787' } } }),
      model.delete({ urlParams, config: { params: { name: 'yesyt' } } })
    ]
    console.log('请求队列信息', httpMW.requests)
    console.log('实际网络请求信息', httpMW.networks)
    Promise.all(asyncs)
      .then(([data1, data2, data3, data4]) => {
        console.log(data1.data)
        console.log(data2.data)
        console.log(data3.data)
        console.log(data4.data)
      })
      .catch((err) => {
        console.log(err.message)
      })
      .finally(done)
  })
  it('#tpl2', () => {
    restDefine(tpl2)
  })
  it('#tplErr', () => {
    utils.try(
      () => {
        restDefine(tplErr)
      }
    )
  })
})
