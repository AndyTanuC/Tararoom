var express 	= require('express');
var router  	= express.Router();
var passport 	= require('passport');
var User 		= require('../models/user');
var Room 		= require('../models/rooms');
var roomRequest = require('../models/room_requests');
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


	Room.findAll().then( function(room_list) {
		// console.log(room_list[0].dataValues.room_requests);
	   	var room_requests = roomRequest.findAll({ include: [{model: Room, required: true}], where: { user_id: req.user.id } }
	   	).then( function(rooms) {

			res.render('dashboard_user',{
				scripts:scripts,
				styles:styles,
				roomlist:room_list,
				rooms: rooms
			});
		});
	}); 
});
//END

// REQUEST ROOM
router.post('/request',isLoggedIn,function(req,res){
	var name 		= req.body.name;
	var room_id 	= req.body.room_id;
	var user_id 	= req.user.id;
	var date_time 	= req.body.date_time;
	var description = req.body.description;

	roomRequest.create({
        name: name,
        user_id: user_id,
        room_id: room_id,
        date_time: date_time,
        description: description
    },{
    	fields: ['name','user_id','room_id','date_time','description']
    }).then(function(data) {
        res.status(200);
        res.redirect('/user/dashboard');
    }).catch(function(error) {
        res.status(500);
        res.json({error:error, stackError:error.stack});
    });
});
// END

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    req.flash('error_msg','You have to login first');
    res.redirect('/user/login');
}

module.exports = router;