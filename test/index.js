/**
 * Created by huangxinxin on 17/9/19.
 */
require('./test.urls')
require('./test.schemas')
require('./test.trans')
require('./test.rest')
require('./test.index')
require('./test.min.index')

// // const mw = require('../src/index')
// const mw = require('../dist/httpmw')
//
// mw.setConfig({ debug: true })
//
// const random = (num) => {
//   return ~~(Math.random() * num)
// }
//
// mw.urls.set([
//   {
//     id: 'test1-get',
//     url: 'http://10.95.38.32:5200/mock/5a17c04697eeb74c9be1e995/example/query/1',
//     method: 'get'
//   },
//   {
//     id: 'test1-put',
//     url: 'http://127.0.0.1:9000/test/<%= id %>',
//     method: 'put',
//     expired: {
//       s: 1
//     }
//   }
// ])
//
// const format = (arr) => arr.map((item) => item.data.status)
//
// const run = () => {
//   Promise.all([
//     mw.request('test1-get'),
//     mw.request('test1-get'),
//     mw.request('test1-get'),
//     mw.request('test1-get'),
//   ]).then(arr => {
//     console.log('get =>', format(arr), [ mw.requests.size, mw.requests.promises, mw.networks.size ], '\n')
//   })
//
//   Promise.all([
//     mw.request('test1-put', { urlParams: { id: 1 }, config: { params: { r: Math.random() } } }),
//     mw.request('test1-put', { urlParams: { id: 1 }, config: { params: { r: Math.random() } } }),
//     mw.request('test1-put', { urlParams: { id: 1 }, config: { params: { r: Math.random() } } }),
//     mw.request('test1-put', { urlParams: { id: 1 }, config: { params: { r: Math.random() } } })
//   ]).then(arr => {
//     console.log('put =>', format(arr), [ mw.requests.size, mw.requests.promises, mw.networks.size ], '\n')
//   })
//
//   console.log([ mw.requests.size, mw.requests.promises, mw.networks.size, mw.networks.details ])
//
//   setTimeout(run, 3000)
// }
//
// run()
