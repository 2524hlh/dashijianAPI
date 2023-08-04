const express = require('express')
const expressJoi = require('@escook/express-joi')

const router = express.Router()

const userinfoHandler = require('../router_handler/userinfo')
const {update_userinfo_schema,update_password_schema,update_avatar_schema} = require('../schema/user')

router.get('/userinfo',userinfoHandler.getUserInfo)
router.post('/userinfo',expressJoi(update_userinfo_schema),userinfoHandler.updateUserInfo)
router.post('/updatepwd',expressJoi(update_password_schema),userinfoHandler.updatePassword)
router.post('/updateAvatar',expressJoi(update_avatar_schema),userinfoHandler.updateAvatar)

module.exports = router