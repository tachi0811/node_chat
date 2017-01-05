var express = require('express');
var router = express.Router();
var db = require('../models');

/* ******************************
session の存在チェック
res
req
  existsSession :  next ->
  other : result : "1"
****************************** */
router.use(function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.send({ result: "1", message: "goto login"});
  }
});

/* ******************************
GET groups listing.
res
  query
    id
    user_id
    group_name
req
  group json
****************************** */
router.get('/groups', function(req, res, next) {
  res.contentType("application/JSON");
  db.group.findAll({
    attributes: ['id', 'group_name'],
    where : {
      user_id : req.session.user.id,
    }
  }).then(function(data){
    if (data.length != 0) {
      res.send({ result: "0", data: JSON.stringify(data) });
    } else {
      res.send({ result: "1", message : "goto login" });
    }
  }).catch(function(err){
    res.send({ result: "1", message : err.message });
  });
});

/* ******************************
GET chats listing.
res
  query
    id
    user_id
    group_name
req
  group_id : string
 ****************************** */
router.get('/chats', function(req, res, next) {
  db.chat.findAll({
    where : {
      group_id : req.query.group_id,
    }
  , order: ['createdAt']
  }).then(function(data){
    res.send({ result: "0", data: JSON.stringify(data) });
  }).catch(function(err){
    res.send({ result: "1", message : err.message });
  });
});

/* ******************************
GET session listing.
res
  query
    search
req
  user json
****************************** */
router.get('/applyUsers', function(req, res, next) {
  // 検索条件を作成（区切り）
  var temp = req.query.search.replace(/　/g, ' ').split(' ');
  var search = [];
  for(var i = 0; i < temp.length; i++) {
    var s = temp[i];
    if (s != "") {
      search.push("%" + s + "%");
    }
  }
  var user_id = req.session.user.id;

  // 既に申請／承認／自ユーザーは除く
  db.friend.findAll({
    where : {
      id : user_id,
    }
  }).then(function(data) {
    // 取得データを配列に格納
    var f_user_ids = [];
    f_user_ids.push(user_id);
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      f_user_ids.push(d["f_user_id"]);
    }
    // 実際の申請対象ユーザーを検索
    db.user.findAll({
      where: {
        id: {
          $notIn: f_user_ids
        },
        $or: {
          email: {
            $like: {$any: search}
          },
          user_name: {
            $like: {$any: search}
          }
        },
      }
    }).then(function(data) {
      res.send({result: "0", data: data});
    }).catch(function(err){
      res.send({ result: "1", message: err.message});
    });
  }).catch(function(err) {
    res.send({ result: "1", message: err.message});
  });
});

/* ******************************
GET session listing.
res
  query
    search
req
  user json
****************************** */
router.get('/approvalUsers', function(req, res, next) {

  var user_id = req.session.user.id;

  // 既に申請／承認／自ユーザーは除く
  db.friend.findAll({
    where : {
      id : user_id,
      approval : req.query.approval,
    }
  }).then(function(data) {
    // 取得データを配列に格納
    var f_user_ids = [];
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      f_user_ids.push(d["f_user_id"]);
    }
    // 実際の申請対象ユーザーを検索
    db.user.findAll({
      where: {
        id: {
          $in: f_user_ids
        },
      }
    }).then(function(data) {
      res.send({result: "0", data: data});
    }).catch(function(err){
      res.send({ result: "1", message: err.message});
    });
  }).catch(function(err) {
    res.send({ result: "1", message: err.message});
  });
});

/* ******************************
POST session listing.
res
  body
    id
req
  group json
****************************** */
router.post('/insertFriend', function(req, res, next){
  /*
  // データの登録
  user & group myChat
  */
  db.sequelize.transaction(function(t){
    return db.friend.create({
      id: req.session.user.id,
      f_user_id: req.body.f_user_id,
      approval: 0
    }, { transaction: t }
    ).then(function(friend){
      return db.friend.create({
        id: req.body.f_user_id,
        f_user_id: req.session.user.id,
        approval: 1
      },{ transaction: t });
    });
  })
  .then(function(result){
    res.send( {result : "0", data: result.values });
  })
  .catch(function(err){
    res.send({ result : "1", message : err.message });
  });
});

/* ******************************
GET session listing.
res
  query
    id
,   name
req
  group json
****************************** */
router.get('/loginUser', function(req, res, next){
  db.group.findOne({
    where: {
      user_id: req.session.user.id,
      chat_type: 0,
    }
  }).then(function(data) {
    res.send({ result: "0", data: { user_id: req.session.user.id, user_name: req.session.user.user_name, my_chat_group_id: data.dataValues.id, my_chat_group_name: data.dataValues.group_name }})
  }).catch(function(err) {
    res.send({ result: "1", message: err.message })
  }); 
});

/* ******************************
POST
res
  body
    group_id
    chat
req
  resut = 0 : success
        = 1 : error
  message   : string
****************************** */
router.post('/insertChat', function(req, res, next) {
  db.chat.max(
    'id', {
        where: {
          group_id: req.body.group_id 
        }
  }).then(function(max){
    if (isNaN(max)) {
      max = 0;
    }
    db.chat.create({
      id: max + 1,
      group_id: req.body.group_id,
      user_id: req.session.user.id,
      chat: req.body.chat
    }).then(function(result){
      res.send({ result: "0", data: result.dataValues });
    }).catch(function(err){
      res.send({ result: "1", message: err.message});
    });
  }).catch(function(e) {
    res.send({ result: "1", message: e.message });
  });
});

/* ******************************
POST
res
  body
    group_id
    chat_id
req
  resut = 0 : success
        = 1 : error
  message   : string
****************************** */
router.post('/deleteChat', function(req, res, next) {
  db.chat.destroy({
    where : {
      group_id : req.body.group_id,
      id : req.body.chat_id 
    }
  }).then(function(data){
    res.send({result: "0", data: data});
  }).catch(function(err){
    res.send({result: "1", message: err.message});
  });
});

/* ******************************
POST
res
  body
    group_id
    chat_id
    chat
req
  resut = 0 : success
        = 1 : error
  message   : string
****************************** */
router.post('/updateChat', function(req, res, next) {
  db.chat.update({
      chat: req.body.chat
    },{
    where: {
      id: req.body.chat_id,
      group_id: req.body.group_id,
    }
  }).then(function(data) {
    db.chat.findOne({
      where: {
        id: req.body.chat_id,
        group_id: req.body.group_id
      }
    }).then(function(data){
      res.send({result: "0", data: data.dataValues});
    }).catch(function(err){
      res.send({ result: "1", message: err.message});
    });
  }).catch(function(err) {
    res.send({ result: "1", message: err.message});
  });
});

module.exports = router;
