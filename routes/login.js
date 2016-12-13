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

  db.user.findAll({
    where : {
      email : req.query.email,
      password : req.query.password
  }})
  .then(function(data){
    res.send(JSON.stringify(data));
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
router.post('/createUser', function(req, res, next) {
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
      // データの登録
      db.sequelize.transaction(function(t){
        return db.user.create({
          email: req.body.email,
          name: req.body.name,
          password: req.body.password
        }, {transaction: t })
        .then(function(user){
          return db.group.create({
            user_id: user.id,
            group_name: "myChat",
          },{ transaction: t });
        });
      })
      .then(function(result){
        res.send( {result : "0", message : "success"});
      })
      .catch(function(err){
        res.send({ result : "1", message : err.message });
      });

      // ------------------------------
      // トランザクションなしの登録
      // ------------------------------
      // db.User.create({
      //   email: req.body.email,
      //   name: req.body.name,
      //   password: req.body.password
      // })
      // .then(function(data){
      //   res.send({result: "0", message: "success"});
      // })
      // .catch(function(err){
      //   res.send({ result : "1", message : err.message});
      // });

    }
  })
  .catch(function(err){
    res.send({ result : "1", message : err.message});
  });
});

router.post('/', function(req, res, next){
  res.send('data');
});

module.exports = router;
