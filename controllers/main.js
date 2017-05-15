var router = require('express').Router();


router.get('/', function(req, res){
	res.end('yo bro!! cool.');
});


module.exports = router;