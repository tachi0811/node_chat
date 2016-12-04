var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(true);
});

router.post('/', function(req, res, next){
  res.send('aaabbbccc');
});

module.exports = router;
