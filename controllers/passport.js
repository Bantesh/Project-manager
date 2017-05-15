var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy();


passport.serializeUser(function(user, done){
	done(null, user._id); 
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user); 
	});
});


passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	User.findOne({ email: email}, function(err, user){
		if(err) return done(err);

		if(!user){
			return done(null, false);
		}

		if(!user.comparePassword(password)){
			return done(null, false);
		}
		return done(null, user);
	});
})); 

/*passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyemail(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));  */


exports.isAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}