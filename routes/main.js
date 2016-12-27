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
  group_id : string
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
  if (req.session.user) {
    db.group.findOne({
      where: {
        user_id: req.session.user.id,
        chat_type: 0,
      }
    }).then(function(data) {
      res.send({ result: "0", data: { user_id: req.session.user.id, user_name: req.session.user.user_name, my_chat_group_id: data.dataValues.id }})
    }).catch(function(err) {
      res.send({ result: "1", message: err.message })
    });
  } else {
    res.send({ result: "1", message: "goto login" });
  }
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

  if (!req.session.user) {
    res.send({ result: "1", message: "goto login"});
  } else {

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
      res.send({ result: "1", data: result.dataValues });
    });
  }
});

module.exports = router;
