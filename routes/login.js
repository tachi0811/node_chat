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
  
    db.User.findAll({
      where : {
        email : req.query.email,
        password : req.query.password
    }})
    .then(function(data){
      res.send(JSON.stringify(data));
    })
    .catch(function(err){
      res.send({ error : "1" });
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
  
  db.User.findOne({
    where : {
      email : req.body.email
    }
  })
  .then(function(data){
    if (data != null) {
      res.send({ result : "1", message : "Exist Mail Address"});
    } else {
      // データの登録
      db.User.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      })
      .then(function(data){
        res.send({result: "0", message: "success"});
      })
      .catch(function(err){
        res.send({ result : "1", message : err.message});
      });
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
