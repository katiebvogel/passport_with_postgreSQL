var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  bcrypt = require('bcrypt');

var UserSchema = new Schema({
  username: {type: String, required: true, index: {unique: true}},
  password: { type: String, required: true}
});



//this is added during Joel's lecture Tuesday
UserSchema.pre('save', function(next){
  var user = this;
  var SALT_WORK_FACTOR = 10;
  if(user.isModified('password')== false){
    return next();
  };

//10 below is the salt work factor.. it's what is added to the original password to create the encrypted password.
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash){
    if(err){
      console.log(err);
    }
    console.log('Hashed Password', hash);
    user.password= hash;
    return next();

  });

});




UserSchema.methods.comparePassword = function(candidatePassword, cb) {

  var user = this;

  bcrypt.compare(candidatePassword, user.password, function(err, isMatch){
    if(err){
      console.log(err);
      cb(err, isMatch);
    } else {
    console.log('isMatch', isMatch);
    cb(null, isMatch);
  }

  // cb(null, this.password == candidatePassword);
});
};

module.exports = mongoose.model('User', UserSchema);
