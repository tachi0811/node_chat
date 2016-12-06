var express = require('express');
var router = express.Router();
// var models = require('../models');

var sequelize = require('sequelize');
var sequelize = new sequelize('sampleDB', 'cent', 'password', {host: "localhost", port: "5432", dialect: "postgres"} );

sequelize.sync();

/* GET users listing. */
router.get('/getUser', function(req, res, next) {
  var email = req.query.email;
  var password = req.query.password;
  var responseData = {"data": email, "password": password};

  res.contentType("application/JSON");

  sequelize.query('select * from sample', { type: sequelize.QueryTypes.SELECT}).
  then(function(data){
    console.log(data);
  });



  // sequelize.query('insert into sample values select max(id) + 1, \'sample\' from sample').spread(function(result, metadata) {
// 
  // });
  //  
  // sequelize.query('update sample set name = \'abc\'').spread(function(result, metadata) {
// 
  // });

  res.send(JSON.stringify(responseData));
});

router.post('/', function(req, res, next){
  res.send('aaabbbccc');
});

module.exports = router;
