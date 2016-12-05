var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getUser', function(req, res, next) {
  var email = req.query.email;
  var password = req.query.password;
  var responseData = {"data": email, "password": password};
  res.contentType("application/JSON");
  res.send(JSON.stringify(responseData));
});

router.post('/', function(req, res, next){
  res.send('aaabbbccc');
});

module.exports = router;
