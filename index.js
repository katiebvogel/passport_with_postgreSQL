var express = require('express')
var router = express.Router();
var path = require('path');

// var app = express();

router.get('/', function(request, response){
  response.sendFile(path.join(__dirname, '/public/views/login.html'));
});


module.exports = router;
