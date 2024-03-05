var express = require('express');
var router = express.Router();

/* GET dontdie listing. */
router.get('/login', function(req, res, next) {
  res.render('dontdie/sign-in');
});

router.get('/index', function(req, res, next) {
  res.render('dontdie/index');
});

module.exports = router;
