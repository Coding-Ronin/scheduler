var express = require('express');
var router = express.Router();

/* Basic Implementation used for Test - Master will use Aaron's Code */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//Partial views
router.get('/partials/:name', function(req, res){
	var name = req.params.name;
	res.render('partials/' + name );
});

//All else redirect to home
router.get('*', function(req, res, next) {
  res.render('index');
});

module.exports = router;
