var pg = require('pg');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var config = {
  database: 'passport',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

function findByUsername(username, callback){
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
    client.query('SELECT * FROM users WHERE username=$1;', [username], function(err, result){
      if(err){
        done();
        return callback(err);
      }

    callback(null, result.rows[0]);
    done();
  });
});
}//end findByUsername function



function create(username, password, callback){

  bcrypt.hash(password, SALT_WORK_FACTOR, function(err, hash){
      pool.connect(function(err, client, done){
            if(err){
              done();
              return callback(err);
           }
    client.query('INSERT INTO users (username, password)' + 'VALUES ($1, $2) RETURNING id, username;', [username, hash], function(err, result){
      if(err){
        done();
        return callback(err);
      }
      callback(null, result.rows[0]);
      console.log(result.rows[0]);
      done();
    }); //end client.query
    }); //end pool.connect
  }); //end bcrypt.hash
}//end create function


function findAndComparePassword(username, candidatePassword, callback){

  findByUsername(username, function(err, user){
    if(err){
      return callback(err);
    }
    if(!user){
      return callback(null);
    }

    bcrypt.compare(candidatePassword, user.password, function(err, isMatch){
      if(err){
        console.log(err);
        return callback(err);
      }else {
        console.log('isMatch', isMatch);
        callback(null, isMatch, user);
      };
    }); //end bcrypt.compare
  }); //end findByUsername
}//end findAndComparePassword



function findById(id, callback){
  pool.connect(function(err, client, done){
    if(err){
      done();
      return callback(err);
    }
  client.query('SELECT * FROM users WHERE id=$1;', [id], function(err, result){
    if(err) {
      done();
      return callback(err);
    }
    callback(null, result.rows[0]);
    done();
  }); //end client.query
  });//end pool.connect
}//end findById



// UserSchema.pre('save', function(next){
//   var user = this;
//   var SALT_WORK_FACTOR = 10;
//   if(user.isModified('password')== false){
//     return next();
//   };
//
// //10 below is the salt work factor.. it's what is added to the original password to create the encrypted password.
//   bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash){
//     if(err){
//       console.log(err);
//     }
//     console.log('Hashed Password', hash);
//     user.password= hash;
//     return next();
//
//   });
//
// });
//
//
//
//
// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//
//   var user = this;
//
//   bcrypt.compare(candidatePassword, user.password, function(err, isMatch){
//     if(err){
//       console.log(err);
//       cb(err, isMatch);
//     } else {
//     console.log('isMatch', isMatch);
//     cb(null, isMatch);
//   }
//
//
// });
// };

module.exports = {
  findByUsername: findByUsername,
  findById: findById,
  create: create,
  findAndComparePassword: findAndComparePassword
};
