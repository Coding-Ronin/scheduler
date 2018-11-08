var express = require('express');
var router = express.Router();

/* Used for Testing, master will use Aaron's Code*/

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
