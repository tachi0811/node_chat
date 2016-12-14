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
  group json
****************************** */
router.get('/groups', function(req, res, next) {
  res.contentType("application/JSON");

  db.group.findAll({
    where : {
      user_id : req.query.user_id,
  }})
  .then(function(data){
    if (data != null) {
      res.send({ result: "0", data: JSON.stringify(data) });
    } else {
      res.send({ result: "1", message : "" });
    }
  })
  .catch(function(err){
    // loging
    
    res.send({ result: "1", message : err.message });
  });

});

module.exports = router;
