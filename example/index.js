/**
 * Created by huangxinxin on 17/9/28.
 */
const httpmw = require('../dist/httpmw')

httpmw.setConfig({ debug: true })

httpmw.schemas.set([
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

httpmw.urls.set([
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

httpmw.trans.set([
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

const urlParams = { id: ~~(Math.random() * 100) }

/* request */
httpmw.request('test1-get', {
  urlParams,
  config: { params: { name: 'yesyt' } }
})

httpmw.request('test1-post', {
  urlParams,
  config: { params: { name: 'yesyt' }, data: { pwd: '123456' } }
})

httpmw.request('test1-put', {
  urlParams,
  config: { data: { pwd: '123456' } }
})

httpmw.request('test1-delete', {
  urlParams,
  config: { params: { name: 'yesyt' } }
})

/* transform */
httpmw.transform('test1', {
  urlParams,
  config: { params: { name: 'yesyt' } }
})

httpmw.transform('test1-1', {
  urlParams,
  config: { params: { name: 'yesyt' } }
})

httpmw.transform('test2', {
  urlParams,
  config: { params: { name: 'yesyt' }, data: { pwd: '123456' } }
})

httpmw.transform('test3', {
  urlParams,
  config: { data: { pwd: '123456' } }
})

httpmw.transform('test4', {
  urlParams,
  config: { params: { name: 'yesyt' } }
})

console.log('networks', httpmw.networks)
console.log('requests', httpmw.requests, '\n')

httpmw.startClearExpired((size) => {
  console.log('size = ', size)
  console.log('networks', httpmw.networks)
  console.log('requests', httpmw.requests, '\n')
})

const model = httpmw.restDefine({
  name: 'user',
  url: 'http://10.95.38.32:5200/mock/5a17c04697eeb74c9be1e995/example/query/<%= id %>',
  urlExpired: [ {
    data: {
      m: 30
    },
    methods: [ 'get' ]
  } ],
  urlSchemas: [ {
    data: {
      request: {
        params: 'REQ-1'
      },
      response: 'RES-1'
    },
    methods: [ 'get', 'delete' ]
  }, {
    data: {
      request: {
        params: 'REQ-1',
        data: 'DATA-1'
      },
      response: 'RES-1'
    },
    methods: [ 'put', 'post' ]
  } ]
})
const asyncs = [
  model.get({ urlParams, config: { params: { name: 'yesyt' } } }),
  model.put({ urlParams, config: { params: { name: 'yesyt' }, data: { pwd: '123456' } } }),
  model.post({ urlParams, config: { params: { name: 'yesyt' }, data: { pwd: '123456787' } } }),
  model.delete({ urlParams, config: { params: { name: 'yesyt' } } })
]
Promise.all(asyncs)
  .then(([ data1, data2, data3, data4 ]) => {
    console.log(`==============${model.name}==============`)
    console.log(data1.data)
    console.log(data2.data)
    console.log(data3.data)
    console.log(data4.data)
    console.log(`--------------${model.name}--------------`)
  })
  .catch((err) => {
    console.log(err.message)
  })

// setTimeout(() => {
//   httpmw.stopClearExpired()
// }, 10000)
