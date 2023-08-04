const path = require('path')
const db = require('../db/index')

exports.getArticle = (req, res) => {
    let lastStr = ''
    if (req.query.cate_id !== '') { lastStr += ' and cate_id=' + req.query.cate_id }
    if (req.query.state !== '') { lastStr += " and state='" + req.query.state + "'" }
    const sqlStr = 'select * from ev_articles where is_delete=0' + lastStr
    db.query(sqlStr, function (err, results) {
        if (err) return res.cc(err)
        const total = results.length
        const pagesize = parseInt(req.query.pagesize)
        const start = parseInt(req.query.start)
        const sqlStr = 'select * from ev_articles where is_delete=0'+ lastStr +' limit ?,?'
        db.query(sqlStr, [start, pagesize], (err, results) => {
            if (err) return res.cc(err)
            res.send({
                status: 0,
                message: '获取文章列表成功',
                data: results,
                total: total
            })
        })
    })
}

exports.addArticle = (req, res) => {
    console.log(req.file);
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数')
    const articleInfo = {
        ...req.body,
        cover_img: path.join('/uploads', req.file.filename),
        pub_date: new Date(),
        author: req.user.id,
    }
    const sqlStr = 'insert into ev_articles set ?'
    db.query(sqlStr, articleInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('文章发布失败')
        res.cc('文章发布成功', 0)
    })
}

exports.deleteArticle = (req, res) => {
    const sqlStr = 'update ev_articles set is_delete=1 where id=?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除文章失败')
        res.cc('删除文章成功', 0)
    })
}