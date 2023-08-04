const express = require('express')
const cors = require('cors')
const expressJWT = require('express-jwt')
const joi = require('joi')
const userRouter = require('./router/user')
const config = require('./config')
const userinfoRouter = require('./router/userinfo')
const artCateRouter = require('./router/artcate')
const articleRouter = require('./router/article')

const app = express()
//跨域
app.use(cors())
//解析req.body
app.use(express.urlencoded({ extended:false }))

app.use(function(req,res,next){
    res.cc = function(err,status = 1){
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/api\//]}))

app.use('/uploads',express.static('./uploads'))
app.use('/api',userRouter)
app.use('/my',userinfoRouter)
app.use('/my/article',articleRouter)
app.use('/my/article',artCateRouter)

app.get('/get',(req,res)=>{
    console.log(req.query);
})

app.post('/post',(req,res)=>{
    res.send(req.body)
})

app.use(function(err,req,res,next){
    console.log(req.user);
    if(err instanceof joi.ValidationError) return res.cc(err)
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    res.cc(err)
})

app.listen(3007,()=>{
    console.log('api server running at http://127.0.0.1:3007');
})