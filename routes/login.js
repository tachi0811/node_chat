var express = require('express');
var router = express.Router();
var db = require('../models');

/* GET users listing. */
router.get('/getUser', function(req, res, next) {
  res.contentType("application/JSON");

  // ====================
  // 直接SQLを発行する
  // ====================
  //  db.sequelize.query('select * from \"Users\"', { type: db.sequelize.QueryTypes.SELECT})
  //  .then(function(data){
  //    res.send(JSON.stringify(data));
  //  });
  try {
    db.User.findAll({
      where : {
        email : req.query.email,
        password : req.query.password
    }})
    .then(function(data){
      res.send(data)
    });
  } catch (err) {
    res.send("error");
    throw(err);
  }
});

/* ******************************
  データ登録
res.query.email
res.query.name
res.query.password
****************************** */
router.post('/createUser', function(req, res, next) {
  res.contentType("application/JSON");
  try {
    db.User.findOne({
      where : {
        email : req.query.email
      }
    })
    .then(function(data){
      if (data.length != 0) {
        res.send({ result : "1", message : "Exist Mail Address"});
      }
      
    });
  } catch(err) {  
    var data = {result : "1", message: "DB Access Error"};
    res.send(JSON.stringify(data));
  }  
});

router.post('/', function(req, res, next){
  res.send('data');
});

module.exports = router;
