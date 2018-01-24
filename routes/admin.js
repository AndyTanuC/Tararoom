var express = require('express');
var router  = express.Router();
var passport= require('passport');
var Admin 	= require('../models/user');
require('../config/passport.js')(passport,Admin);

// Get Login Admin
router.get('/login',function(req,res){
	res.render('login_admin');
});

// POST Login User
router.post('/login', passport.authenticate('local-signin-admin',{successRedirect:'/admin/dashboard', failureRedirect: '/admin/login', failureFlash: true}));

router.get('/logout', function(req,res){
	req.session.destroy(function(err) {
  		res.redirect('/admin/login');
  	});
});

// Get Dashboard
router.get('/dashboard', isLoggedIn ,function(req,res){
	res.render('dashboard_admin');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    req.flash('error_msg','You have to login first');
    res.redirect('/admin/login');
}

module.exports = router;