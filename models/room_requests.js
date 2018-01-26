var Sequelize = require('sequelize');
// var User 	= require('./user');
var Room 	= require('./rooms');
const db = require('../db');

var roomRequest = db.define('room_request', {
    id: { 
    	autoIncrement: true, 
    	primaryKey: true, 
    	type: Sequelize.INTEGER
    },
    name: { 
    	type: Sequelize.STRING,
    	notEmpty: true
    },
    date_time: {
    	type: Sequelize.DATE, 
    	notEmpty: true
    },
    description: {
    	type:Sequelize.TEXT
    },
    user_id: { 
    	type: Sequelize.INTEGER, 
    	foreignKey: true, 
    	notEmpty: true
    },
    room_id: { 
    	type: Sequelize.INTEGER, 
    	foreignKey: true, 
    	notEmpty: true
    },
    status: {
    	type: Sequelize.ENUM('waiting', 'accepted', 'declined'),
    	defaultValue: 'waiting',
    	notEmpty: true
    }
});

// roomRequest.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});
// roomRequest.belongsTo(Room, {foreignKey: 'room_id', targetKey: 'id'});


// roomRequest.sync({force: true});

module.exports = roomRequest;