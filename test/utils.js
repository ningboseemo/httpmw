/**
 * Created by huangxinxin on 17/9/27.
 */
const assert = require('assert')
const Promise = require('bluebird')

module.exports = {
  try (...args) {
    const doTry = (cb) => {
      try {
        cb()
      } catch (err) {
        console.log('\t', err.message)
      }
    }
    const len = args.length
    for (let i = 0; i < len; i++) {
      const cb = args[ i ]
      if (cb instanceof Function) {
        doTry(cb)
      }
    }
  },
  testAll (httpMW) {
    describe('完整测试', () => {
      before(() => {
        // schemas
        httpMW.schemas.clear()
        httpMW.schemas.set([
          {
            id: 'REQ-1',
            type: 'object',
            properties: {
              name: {
                type: 'string',
                minLength: 1
              }
            }
          },
          {
            id: 'DATA-1',
            type: 'object',
            properties: {
              pwd: {
                type: 'string',
                minLength: 1
              }
            }
          },
          {
            id: 'RES-1',
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string'
                  }
                }
              },
              message: {
                type: 'string'
              },
              status: {
                type: 'number'
              }
            }
          }
        ])
        // urls
        httpMW.urls.clear()
        httpMW.urls.set([
          {
            id: 'test1-get',
            url: 'http://10.95.38.32:5200/mock/5a17c04697eeb74c9be1e995/example/query/<%= id %>',
            method: 'get',
            expired: {
              s: 10
            },
            schema: {
              request: {
                params: 'REQ-1'
              },
              response: 'RES-1'
            }
          },
          {
            id: 'test1-post',
            url: 'http://10.95.38.32:5200/mock/5a17c04697eeb74c9be1e995/example/query/<%= id %>',
            method: 'post',
            expired: {
              s: 5
            },
            schema: {
              request: {
                params: 'REQ-1',
                data: 'DATA-1'
              },
              response: 'RES-1'
            }
          },
          {
            id: 'test1-put',
            url: 'http://10.95.38.32:5200/mock/5a17c04697eeb74c9be1e995/example/query/<%= id %>',
            method: 'put',
            expired: {
              s: 13
            },
            schema: {
              request: {
                data: 'DATA-1'
              },
              response: 'RES-1'
            }
          },
          {
            id: 'test1-delete',
            url: 'http://10.95.38.32:5200/mock/5a17c04697eeb74c9be1e995/example/query/<%= id %>',
            method: 'delete',
            expired: {
              s: 20
            },
            schema: {
              request: {
                params: 'REQ-1'
              },
              response: 'RES-1'
            }
          }
        ])
        // trans
        httpMW.trans.clear()
        httpMW.trans.set([
          {
            id: 'test1',
            urlId: 'test1-get',
            processor (res, resolve, reject) {
              resolve(res.data.data)
            }
          },
          {
            id: 'test1-1',
            urlId: 'test1-get',
            processor (res, resolve, reject) {
              resolve(res.data.message)
            }
          },
          {
            id: 'test2',
            urlId: 'test1-post',
            processor (res, resolve, reject) {
              resolve(res.data.data)
            }
          },
          {
            id: 'test3',
            urlId: 'test1-put',
            processor (res, resolve, reject) {
              resolve(res.data.data)
            }
          },
          {
            id: 'test4',
            urlId: 'test1-delete',
            processor (res, resolve, reject) {
              resolve(res.data.data)
            }
          }
        ])
      })

      it('#request', (done) => {
        const urlParams = { id: ~~(Math.random() * 100) }
        const asyncs = []
        for (let i = 0; i < 10; i++) {
          asyncs.push(
            httpMW.request('test1-get', { urlParams, config: { params: { name: 'yesyt' } } }),
            httpMW.request('test1-post', { urlParams, config: { params: { name: 'yesyt' }, data: { pwd: '123456' } } }),
            httpMW.request('test1-put', { urlParams, config: { data: { pwd: '123456' } } }),
            httpMW.request('test1-delete', { urlParams, config: { params: { name: 'yesyt' } } })
          )
        }
        console.log('请求队列信息', httpMW.requests)
        console.log('实际网络请求信息', httpMW.networks)
        Promise.all(asyncs)
          .catch((err) => {
            console.log(err.message)
          })
          .finally(done)
      })

      it('#transform', (done) => {
        const urlParams = { id: ~~(Math.random() * 100) }
        const asyncs = []
        for (let i = 0; i < 10; i++) {
          asyncs.push(
            httpMW.transform('test1', { urlParams, config: { params: { name: 'yesyt' } } }),
            httpMW.transform('test1-1', { urlParams, config: { params: { name: 'yesyt' } } }),
            httpMW.transform('test2', { urlParams, config: { params: { name: 'yesyt' }, data: { pwd: '123456' } } }),
            httpMW.transform('test3', { urlParams, config: { data: { pwd: '123456' } } }),
            httpMW.transform('test4', { urlParams, config: { params: { name: 'yesyt' } } })
          )
        }
        console.log('请求队列信息', httpMW.requests)
        console.log('实际网络请求信息', httpMW.networks)
        Promise.all(asyncs)
          .catch((err) => {
            console.log(err.message)
          })
          .finally(done)
      })

      it('#clearExpired', function (done) {
        this.timeout(60 * 1000)
        new Promise((resolve, reject) => {
          httpMW.startClearExpired((size) => {
            console.log('缓存长度', size)
            if (!size) {
              resolve()
            }
          })
        }).catch((err) => {
          console.log(err.message)
        }).finally(done)
      })

    })
  }
}
