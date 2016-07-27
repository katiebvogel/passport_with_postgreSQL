var express = require('express');
var bodyParser = require('body-parser');
var index = require('./index');
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('./models/user');
var register = require('./routes/register');
var login = require('./routes/login');


var app = express();
var mongoURI = "mongodb://localhost:27017/prime_example_passport";
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err){
  console.log('mongodb connection error', err);
});

MongoDB.once('open', function(){
  console.log('mongodb connection open');
});

app.use(session({
  secret: 'secret',  //never use this again!
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 60000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
//We will require the url encoded body parser because of the way the index.html form is taking in information and routing as an html endpoint
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);

app.use('/register', register);
app.use('/login', login);

app.use(express.static('public'));


//this is the rest of the function for authenticating users
passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if(err) {
      return done(err);
    }
    done(null, user);
  });
});



passport.use('local', new localStrategy({ passReqToCallback: true, usernameField: 'username' },
function(request, username, password, done) {
  User.findOne({ username: username}, function(err, user){
    if(err) {
      throw err
    };
    if(!user) {
      return done(null, false, {message: 'Incorrect username and password.'});
    }

    //test a matching password
    user.comparePassword(password, function(err, isMatch){
      if (err) {
        throw err;
      }
      if (isMatch) {
        return done(null, user);
      } else {
        done(null, false, {message: 'Incorrect username and password.'});
      }
    }); //end user.comparePassword
  }); //end User.findOne
}) //end function including findOne
);//end passport.use



var server = app.listen(3000, handleServerStart);

function handleServerStart(){
  var port = server.address().port;
  console.log('Listening on port', port);
}
