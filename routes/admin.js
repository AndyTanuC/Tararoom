var express 	= require('express');
var router  	= express.Router();
var passport	= require('passport');
var Admin 		= require('../models/user');
var User 		= require('../models/user');
var Room 		= require('../models/rooms');
var roomRequest = require('../models/room_requests');
const db 		= require('../db');
const Op 		= db.Op;

require('../config/passport.js')(passport,Admin);

// Get Login Admin
router.get('/login',function(req,res){
	res.render('login_admin');
});

// POST Login Admin
router.post('/login', passport.authenticate('local-signin-admin',{successRedirect:'/admin/dashboard', failureRedirect: '/admin/login', failureFlash: true}));

router.get('/logout', function(req,res){
	req.session.destroy(function(err) {
  		res.redirect('/admin/login');
  	});
});

// Get Dashboard
router.get('/dashboard', isLoggedIn ,function(req,res){
	var room_request = roomRequest.findAll({ include: [{model: Room, required: true},{model: User, required: true}], where: { status: 'waiting' }}
   	).then( function(requestList) {

   		var request_history = roomRequest.findAll({ 
   			include: [{model: Room, required: true},{model: User, required: true}], 
   			where: { 
   				status:  {
   					[Op.or]: ['accepted', 'declined']
   				}
   			}
   		}).then( function(requestHistory){
   			var scripts = [
				{ script: '/js/admin.js'},
				{ script: 'https://unpkg.com/sweetalert2@7.7.0/dist/sweetalert2.all.js'}
			];


   			res.render('dashboard_admin',{
				rooms: requestList,
				history: requestHistory,
				scripts: scripts
			});
   		});
	});
});

router.post('/confirm', isLoggedIn, function(req,res){
	roomRequest.find({ where: { id: req.body.request_id } }).then( function (room_request) {
	    if(room_request) {
	      	room_request.updateAttributes({
	        status: 'accepted'
	      }).then(function(result) {
	      		console.log(result);
	      		res.status(200).send('success');
	      }).catch(function(error){
	      		console.log(error);
	      		res.status(500).send('failed');
	      });
	    }
  	}).catch(function(error){
  		console.log(error);
      	res.status(404).send('data not found');
  	});
});

router.post('/decline', isLoggedIn, function(req,res){
	roomRequest.find({ where: { id: req.body.request_id } }).then( function (room_request) {
	    if(room_request) {
	      	room_request.updateAttributes({
	        status: 'declined'
	      }).then(function(result) {
	      		console.log(result);
	      		res.status(200).send('success');
	      }).catch(function(error){
	      		console.log(error);
	      		res.status(500).send('failed');
	      });
	    }
  	}).catch(function(error){
  		console.log(error);
      	res.status(404).send('data not found');
  	});
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    req.flash('error_msg','You have to login first');
    res.redirect('/admin/login');
}

module.exports = router;