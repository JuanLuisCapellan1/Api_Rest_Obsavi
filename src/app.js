const config = require('../src/config')
const express = require('express')
require('../src/database/db')
const routesMain = require('../src/routes/index')
const session = require('express-session')
const bodyParser = require('body-parser')
const morgan = require('morgan')

let helmet = require("helmet");
let app = express();
app.use(helmet.hidePoweredBy());

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

morgan.token('params', req => {
  return JSON.stringify(req.params)
})

app.use(morgan(':method :url :status :body :params - :response-time ms'))

app.use(session({
  secret: config.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 899999
  }
}))

app.use(routesMain)

app.listen(config.PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${config.PORT} `)
})
