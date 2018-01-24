//load bcrypt
var bcrypt = require('bcryptjs');

module.exports = function(passport,user){

  var User = user;

  var LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if(user){
        done(null, user.get());
      }
      else{
        done(user.errors,null);
      }
    });
  });
      
    //LOCAL SIGNIN USER
  passport.use('local-signin', new LocalStrategy(
  {
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, username, password, done) {
    var User = user;

    var isValidPassword = function(userpass,password){
      return bcrypt.compareSync(password, userpass);
    }

    User.findOne({ where : { username: username}}).then(function (user) {

      if (!user) {
        return done(null, false, { message: 'User does not exist' });
      }

      if (!isValidPassword(user.password,password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      var userinfo = user.get();

      return done(null,userinfo);

    }).catch(function(err){

      console.log("Error:",err);

      return done(null, false, { message: 'Something went wrong with your Signin' });

    });

  }
  ));

  //LOCAL SIGNIN ADMIN
  passport.use('local-signin-admin', new LocalStrategy(
  {
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  }, function(req, username, password, done) {
    var User = user;

    var isValidPassword = function(userpass,password){
      return bcrypt.compareSync(password, userpass);
    }

    User.findOne({ where : { username: username, admin: true}}).then(function (user) {

      if (!user) {
        return done(null, false, { message: 'Admin does not exist' });
      }

      if (!isValidPassword(user.password,password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      var userinfo = user.get();

      return done(null,userinfo);

    }).catch(function(err){

      console.log("Error:",err);

      return done(null, false, { message: 'Something went wrong with your Signin' });
    });
    }
  ));
}