var express = require('express');
var router = express.Router();
var db = require('../models');

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

  if (!req.session.user) {
    res.send({ result: "1", message: "goto login"});
  } else {
    db.group.findAll({
      attributes: ['id', 'group_name'],
      where : {
        user_id : req.session.user.id,
      }})
    .then(function(data){
      if (data.length != 0) {
        res.send({ result: "0", data: JSON.stringify(data) });
      } else {
        res.send({ result: "1", message : "goto login" });
      }
    })
    .catch(function(err){
      res.send({ result: "1", message : err.message });
    });
  }
});

/* ******************************
GET chats listing.
res
  query
    id
    user_id
    group_name
req
  group json
 ****************************** */
router.get('/chats', function(req, res, next) {
  if (!req.session.user) {
    res.send({ result: "1", message: "goto login"});
  } else {
    db.chat.findAll({
      where : {
        group_id : req.query.group_id,
    }})
    .then(function(data){
      res.send({ result: "0", data: JSON.stringify(data) });
    })
    .catch(function(err){
      res.send({ result: "1", message : err.message });
    });
  }
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
  if (!req.session.user) {
    res.send({ result: "1", message: "goto login"});
  } else {
    res.send({ result: "0", data: req.session.user });
  }
});

module.exports = router;
