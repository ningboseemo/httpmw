const pkg = require('../package.json')
const express = require('express')

const app = express()

const port = 9000

const test = (req, res) => {
  const tm = ~~(Math.random() * 3000)
  setTimeout(() => {
    res.json({ status: tm }).end()
  }, tm)
}

app.use('/test/:id', test)

app.listen(port, () => {
  console.log(`${pkg.name}@${pkg.version} test server listening on port ${port}`)
})