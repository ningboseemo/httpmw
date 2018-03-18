# @qnpm/httpmw
## 浏览器端的HTTP中间件

## 安装

```
cnpm install --save @qnpm/httpmw
```

## 使用
```
import httpmw from '@qnpm/httpmw'
```

## APIs
- setConfig(opts) 参数配置
  - opts
    - debug 是否是调试状态，调试状态会始终打印error信息，默认false

- schemas [具体schema使用文档请戳](https://github.com/epoberezkin/ajv)
  - add(opts) 增加一个配置，返回当前成员总数
  ```
  httpmw.schemas.add({
    id: 'REQ-1',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1
      }
    }
  })
  ```
  - set(array) 设置多个配置，返回当前成员总数
  ```
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
  ```
  - has(id) 返回一个布尔值，表示某个键是否存在
  - get(id) 返回id对应的值，如果找不到则返回undefined
  - delete(id) 删除某个id，返回true。如果删除失败，返回false
  - clear() 清除所有成员，没有返回值
  - getAll() 返回一个包含所有成员的数组
  - size属性 当前成员总数

- urls
  - add(opts) 增加一个配置，返回当前成员总数
    - opts 
      - id [必填] 唯一标识
      - url [必填] URL，可以配合[template](https://lodash.com/docs/4.17.4#template)定义url参数
      - method [必填] Http方法，支持get,put,post,delete
      - expired 缓存过期
        - s 秒数
        - m 分钟数
        - h 小时数
        - d 天数
        - M 月数
        - y 年数
      - schema  格式校验配置
        - request 请求
          - params  query string 校验schema的id
          - data    [put] [post] data校验schema的id
        - response 响应数据校验schema的id
  ```
  httpmw.urls.add({
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
  })
  ```
  - set(array) 设置多个配置，返回当前成员总数
  ```
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
  ```
  - has(id) 返回一个布尔值，表示某个键是否存在
  - get(id) 返回id对应的值，如果找不到则返回undefined
  - delete(id) 删除某个id，返回true。如果删除失败，返回false
  - clear() 清除所有成员，没有返回值
  - getAll() 返回一个包含所有成员的数组
  - size属性 当前成员总数

- trans
  - add(opts) 增加一个配置，返回当前成员总数
    - opts
      - id[必填] 唯一标识
      - urlId[必填] url唯一标识
      - processor[必填] 处理器函数
  ```
  httpmw.trans.add({
    id: 'test1',
    urlId: 'test1-get',
    processor (res, resolve, reject) {
      resolve(res.data.data)
    }
  })
  ```
  - set(array) 设置多个配置，返回当前成员总数
  ```
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
  ```
  - has(id) 返回一个布尔值，表示某个键是否存在
  - get(id) 返回id对应的值，如果找不到则返回undefined
  - delete(id) 删除某个id，返回true。如果删除失败，返回false
  - clear() 清除所有成员，没有返回值
  - getAll() 返回一个包含所有成员的数组
  - size属性 当前成员总数

- request(urlId, { urlParams = {}, config = {} }) 数据请求，返回一个Promise
  - urlId[必填] url唯一标识
  - urlParams 通过[template](https://lodash.com/docs/4.17.4#template)定义的url参数
  - config 参考[Axios Request Config](http://10.95.24.22:5011/package/axios)
  ```
  const urlParams = { id: ~~(Math.random() * 100) }
  httpmw.request('test1-get', { urlParams, config: { params: { name: 'yesyt' } } })
  httpmw.request('test1-post', { urlParams, config: { params: { name: 'yesyt' }, data: { pwd: '123456' } } })
  httpmw.request('test1-put', { urlParams, config: { data: { pwd: '123456' } } })
  httpmw.request('test1-delete', { urlParams, config: { params: { name: 'yesyt' } } })
  ```

- transform(transId, { urlParams = {}, config = {} }) 需要数据转换的请求，返回一个Promise
  - transId[必填] trans唯一标识
  - urlParams 通过[template](https://lodash.com/docs/4.17.4#template)定义的url参数
  - config 参考[Axios Request Config](http://10.95.24.22:5011/package/axios)
  ```
  httpmw.transform('test1', { urlParams, config: { params: { name: 'yesyt' } } })
  httpmw.transform('test1-1', { urlParams, config: { params: { name: 'yesyt' } } })
  httpmw.transform('test2', { urlParams, config: { params: { name: 'yesyt' }, data: { pwd: '123456' } } })
  httpmw.transform('test3', { urlParams, config: { data: { pwd: '123456' } } })
  httpmw.transform('test4', { urlParams, config: { params: { name: 'yesyt' } } })
  ```

- startClearExpired(callback) 执行清除过期缓存的轮询任务
- stopClearExpired() 停止清除过期缓存的轮询任务
- getRequestContext(id) 获取该id请求的详细信息

- networks属性
  - size 未完成的网络请求数
  - details 未完成的网络请求ID列表

- requests属性
  - size 缓存的请求数
  - promises 所有请求缓存的Promise数
  - contexts 所有请求的详细信息列表

  
- restDefine({name, url, methods, urlExpired, urlSchemas, schemas, trans}) 定义一个restful模型，返回一个对象{name, url, get, put, post, delete}
  - name[必填]
  - url[必填]
  - methods Http方法，默认[ 'get', 'put', 'post', 'delete' ]，可选值也是这四个，按需设置，默认全部
  - urlExpired 过期时间，默认[], 数据结构[ {data, methods} ]
    - data 同url.add中的opts.expired
    - methods 同上methods
  - urlSchemas 格式校验配置，默认[], 数据结构[ {data, methods} ]
    - data 同url.add中的opts.schema
    - methods 同上methods
  - schemas 同schemas.set中的arr
  - trans 同trans.set中的arr
  ```
  const urlParams = { id: ~~(Math.random() * 100) }
  const user = httpmw.restDefine({
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
    user.get({ urlParams, config: { params: { name: 'yesyt' } } }),
    user.put({ urlParams, config: { params: { name: 'yesyt' }, data: { pwd: '123456' } } }),
    user.post({ urlParams, config: { params: { name: 'yesyt' }, data: { pwd: '123456787' } } }),
    user.delete({ urlParams, config: { params: { name: 'yesyt' } } })
  ]
  Promise.all(asyncs)
    .then(([ data1, data2, data3, data4 ]) => {
      console.log(`==============${user.name}==============`)
      console.log(data1.data)
      console.log(data2.data)
      console.log(data3.data)
      console.log(data4.data)
      console.log(`--------------${user.name}--------------`)
    })
    .catch((err) => {
      console.log(err.message)
    })
  ```
    


## 更新日志
- v1.0.8
  - [#] 修复了当设置url schema时必须同时设置request和response的bug
- v1.0.7
  - [#] 修复了queue非空就删除request的bug
  - [+] 增加了Debug，请求和响应的Log
  - [+] 增加了getRequestContext方法
- v1.0.6
  - [#] 修复了多个相同请求未设置缓存时已请求过就不会更新的Bug
- v1.0.5
  - [#] 修复了多个相同请求Promise没有返回的Bug
- v1.0.4
  - [+] 增加restDefine接口
- v1.0.3
  - [+] 增加setConfig接口
- v1.0.2
  - [#] 修复了上一个版本没有build的bug
  - [+] error上增加了response对象
- v1.0.1 
  - [+] request 和 response 错误中信息增加了url id
- v1.0.0