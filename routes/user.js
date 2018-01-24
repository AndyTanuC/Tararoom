var express 	= require('express');
var router  	= express.Router();
var passport 	= require('passport');
var User 		= require('../models/user');
require('../config/passport.js')(passport,User);


// AUTHENTICATION
	// Get Login User
	router.get('/login',function(req,res){
		res.render('login_user');
	});

	// POST Login User
	router.post('/login', passport.authenticate('local-signin',{successRedirect:'/user/dashboard', failureRedirect: '/user/login', failureFlash: true}));

	router.get('/logout', function(req,res){
		req.session.destroy(function(err) {
	  		res.redirect('/user/login');
	  	});
	});
//END

// DASHBOARD
router.get('/dashboard', isLoggedIn ,function(req,res){
	var styles = [
		{style: '/css/bootstrap-datetimepicker-standalone.css'},
		{style: '/css/bootstrap-datetimepicker.css'}
	];

	var scripts = [
		{ script: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/js/bootstrap-datetimepicker.min.js'},
		{ script: '/js/user.js'}
	];

	res.render('dashboard_user',{
		scripts:scripts,
		styles:styles
	});
});
//END

// REQUEST ROOM
router.post('/request',isLoggedIn,function(req,res){
	var name 		= req.body.name;
	var datetime 	= req.body.datetime;
	var description = req.body.description;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('datetime', 'Date Time is required').notEmpty();
	
	var errors = req.validationErrors();

	if(errors){
		res.render('dashboard_user',{
			scripts:scripts,
			styles:styles,
			errors:errors
		});
	} else {

	}
});
// END

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    req.flash('error_msg','You have to login first');
    res.redirect('/user/login');
}

module.exports = router;