var express = require('express');
var router = express.Router();
var db = require('../models');

/* ******************************
GET users listing.
res
  query
    email
    password
req
  user json
****************************** */
router.get('/getUser', function(req, res, next) {
  res.contentType("application/JSON");

  // ====================
  // 直接SQLを発行する
  // ====================
  //  db.sequelize.query('select * from \"Users\"', { type: db.sequelize.QueryTypes.SELECT})
  //  .then(function(data){
  //    res.send(JSON.stringify(data));
  //  });

  db.user.findOne({
    where : {
      email : req.query.email,
      password : req.query.password
  }})
  .then(function(data){
    if (data != null) {
      res.send({ result: "0", data: JSON.stringify(data) });
    } else {
      res.send({ result: "1", message : "ユーザーが存在しません" });
    }
  })
  .catch(function(err){
    res.send({ result: "1", message : err.message });
  });
});

/* ******************************
post/createUser
  req
    query
      email
      name
      password
  res
    json
****************************** */
router.post('/createAccount', function(req, res, next) {
  res.contentType("application/JSON");
  
  db.user.findOne({
    where : {
      email : req.body.email
    }
  })
  .then(function(data){
    if (data != null) {
      res.send({ result : "1", message : "メールアドレスは既に登録されています"});
    } else {
      // 
      // データの登録
      // user & group myChat
      db.group.max('id')
      .then(function(max){
        if (isNaN(max)) {
          max = 0;
        }
        db.sequelize.transaction(function(t){
          return db.user.create({
            email: req.body.email,
            user_name: req.body.name,
            password: req.body.password
          }, {transaction: t })
          .then(function(user){
            req.session.user = { user_name: user.dataValues.user_name, id:user.dataValues.id };
            return db.group.create({
              id: max + 1,
              user_id: user.id,
              group_name: "myChat",
              permission: 1,  // 管理者
              chat_type: 0,
            },{ transaction: t });
          });
        })
        .then(function(result){
          res.send( {result : "0", message : "success"});
        })
        .catch(function(err){
          res.send({ result : "1", message : err.message });
        });
      }).catch(function(err) {
        res.send({ result : "1", message : err.message });
      });

    }
  })
  .catch(function(err){
    res.send({ result : "1", message : err.message});
  });
});

/* ******************************
POST users listing.
res
  query
    email
    password
req
  user json
****************************** */
router.post('/', function(req, res, next){
  // res.send('data');
  res.contentType("application/JSON");

  db.user.findOne({
    where : {
      email : req.body.email,
      password : req.body.password
  }})
  .then(function(data){
    if (data != null) {
      var session_user = req.session.user;
      req.session.user = { user_name: data.user_name, id:data.id };
      if (session_user != undefined && session_user.id != data.id) {
        res.send({ result: "0", data: JSON.stringify(data), before_user_id: session_user.id, is_diff_user: true });
      } else {
        res.send({ result: "0", data: JSON.stringify(data), is_diff_user: false });
      }
    } else {
      res.send({ result: "1", message : "ユーザーが存在しません" });
    }
  })
  .catch(function(err){
    res.send({ result: "1", message : err.message });
  });

});

module.exports = router;
