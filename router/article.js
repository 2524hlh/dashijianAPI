const express = require('express')
const multer = require('multer')
const path = require('path')
const article_handler = require('../router_handler/article')

const expressJoi = require('@escook/express-joi')
const {add_article_schema,delete_article_schema} = require('../schema/article')

const router = express.Router()

const upload = multer({dest:path.join(__dirname,'../uploads')})

router.get('/list',article_handler.getArticle)
router.post('/add',upload.single('cover_img'),expressJoi(add_article_schema),article_handler.addArticle)
router.get('/deleteArticle/:id',expressJoi(delete_article_schema),article_handler.deleteArticle)

module.exports = router