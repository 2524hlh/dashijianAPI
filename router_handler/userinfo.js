const db = require('../db/index')
const bcrypt = require('bcryptjs')

exports.getUserInfo = (req, res) => {
    const sqlStr = 'select id, username, nickname, email, user_pic from ev_users where id=?'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取用户信息失败')
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0]
        })
    })
}

exports.updateUserInfo = (req, res) => {
    const sqlStr2 = 'update ev_users set ? where id=?'
    db.query(sqlStr2, [req.body, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('修改用户信息失败!')
        return res.cc('修改用户信息成功', 0)
    })
}

exports.updatePassword = (req, res) => {
    const sqlStr = 'select * from ev_users where id=?'
    db.query(sqlStr, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在')
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码不正确')
        const sqlStr2 = 'update ev_users set password=? where id=?'
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(sqlStr2, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc(err)
            return res.cc('密码修改成功', 0)
        })
    })
}

exports.updateAvatar = (req, res) => {
    const sqlStr2 = 'update ev_users set user_pic=? where id=?'
    db.query(sqlStr2, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败')
        return res.cc('头像修改成功', 0)
    })
}