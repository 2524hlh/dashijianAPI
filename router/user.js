const express = require('express')
const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')
const userHandler = require('../router_handler/user')

const router = express.Router()


router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser)

router.post('/login', expressJoi(reg_login_schema), userHandler.login)

module.exports = router