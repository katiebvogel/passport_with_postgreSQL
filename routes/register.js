var router = require('express').Router();
var passport = require('passport');
var path = require('path');
var Users = require('../models/user');

router.get('/', function(request, response, next){
  response.sendFile(path.resolve(__dirname, '../public/views/register.html'));
}); //end router.get

router.post('/', function(request, response, next){
  Users.create(request.body, function(err, post){
    if(err){
      next(err);
    } else {
      //user has been registered, but they haven't logged in.
      //redirecting them to the login page
      response.redirect('/');
    }
  }) //end Users.create

}); //end router.post

module.exports = router;
