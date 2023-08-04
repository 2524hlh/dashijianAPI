const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config')
const db = require('../db/index') 

exports.regUser = (req, res) => {
    const userinfo = req.body
    if (!userinfo.username || !userinfo.password) {
        return res.cc('用户名或密码不能为空')
    }
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, [userinfo.username], function (err, results) {
        if (err) {
            return res.cc(err)
        }
        if (results.length > 0) {
            return res.cc('该用户名被占用，请更换其他用户名！')
        }
        userinfo.password = bcrypt.hashSync(userinfo.password,10)
        const sqlStr2 = 'insert into ev_users set ?'
        db.query(sqlStr2,{username:userinfo.username,password:userinfo.password},(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows !== 1){
                return res.cc('注册失败，请稍后再试！')
            }
            res.cc('注册成功',0)
        })
    })
}

exports.login = (req, res) => {
    const userinfo = req.body
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr,userinfo.username,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length!==1) return res.cc('没有该用户名！')
        const compareResult = bcrypt.compareSync(userinfo.password,results[0].password)
        if(!compareResult) return res.cc('密码或用户名不正确！')
        const user = {...results[0],password:'',user_pic:''}
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:'10h'})
        console.log(jwt.verify(tokenStr,'hlhnb'));
        res.send({
            status:0,
            message:'登录成功',
            token:'Bearer '+tokenStr
        })
    })
}
