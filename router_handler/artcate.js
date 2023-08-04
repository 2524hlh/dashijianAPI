const db = require('../db/index')

exports.getArticleCates = (req,res)=>{
    const sqlStr = 'select * from ev_article_cate where is_delete=0 order by id asc'
    db.query(sqlStr,(err,results)=>{
        if(err) return res.cc(err)
        res.send({
            status:0,
            message:'获取文章分类列表成功',
            data:results
        })
    })
}

exports.addArticleCates = (req,res)=>{
    const sqlStr = 'select * from ev_article_cate where name=? or alias=?'
    db.query(sqlStr,[req.body.name,req.body.alias],(err,results)=>{
        if(err) return res.cc(err)
        if(results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if(results.length === 1&&results[0].name ===req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if(results.length === 1&&results[0].alias ===req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
        const sqlStr2 = 'insert into ev_article_cate set ?'
        db.query(sqlStr2,req.body,(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows!==1)return res.cc('新增分类失败')
            res.cc('新增文章分类成功',0)
        })
    })
}

exports.deleteCateById = (req,res)=>{
    const id = parseInt(req.params.id)
    const sqlStr = 'update ev_article_cate set is_delete=1 where id=?'
    db.query(sqlStr,id,(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !==1) return res.cc('删除文章分类失败')
        res.cc('删除文章分类成功',0)
    })
}

exports.getArticleById = (req,res) =>{
    const sqlStr = 'select * from ev_article_cate where id=?'
    db.query(sqlStr,req.params.id,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length !==1) return res.cc('获取文章分类失败')
        res.send({
            status:0,
            message:'获取文章分类成功',
            data:results[0]
        })
    })
}

exports.updateCateById = (req,res) =>{
    sqlStr = `select * from ev_article_cate where id!=? and (name=? or alias=?)`
    db.query(sqlStr,[req.body.id, req.body.name, req.body.alias],(err,results)=>{
        if(err) return res.cc(err)
        if(results.length === 2) return res.cc('分类名称与别名被占用')
        if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用')
        if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用')
        sqlStr2 = 'update ev_article_cate set ? where Id=?'
        db.query(sqlStr2,[req.body,req.body.id],(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows !==1) return res.cc('更新失败')
            res.cc('更新成功',0)
        })
    })
}