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

router.post('/', function(req, res, next){
  res.send('data');
});

module.exports = router;
