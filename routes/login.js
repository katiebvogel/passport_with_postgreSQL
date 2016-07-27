var router = require('express').Router();
var passport = require('passport');
var path = require('path');
// var mongoose = require('mongoose');
//
// mongoose.connect('mongodb://localhost/users');

router.get('/', function(request, response){
  response.sendFile(path.resolve(__dirname, '../public/views/login.html'));
});

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/views/success.html',
    failureRedirect: '/views/failure.html'
  })
);

router.get('/', function(request, response, next){
  response.json(request.isAuthenticated());
});





module.exports = router
