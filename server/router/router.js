const express = require('express')
const api = express.Router() // API Router

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

api.use("/user", require("./userRouter.js")) 
api.use("/file", require("./fileRouter.js")) 

module.exports = api