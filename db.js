var Sequelize = require('sequelize');

var db = new Sequelize('postgres://postgres:admin@localhost:5432/taralite',{
	dialect: 'postgres',
	logging: false,
});

module.exports = db;

// Set the model
var user 			= require('./models/user');
var rooms 			= require('./models/rooms');
var room_request 	= require('./models/room_requests');

room_request.belongsTo(rooms, {foreignKey: 'room_id', targetKey: 'id'});
room_request.belongsTo(user, {foreignKey: 'user_id', targetKey: 'id'});
// rooms.hasMany(room_request, { foreignKey: 'room_id', targetKey: 'id'});
// user.hasMany(room_request, {foreignKey: 'user_id', targetKey: 'id'});
// rooms.belongsToMany(room_request);
// user.belongsToMany(rooms, {
//   through: {
//     model: room_request,
//     unique: false
//   },
//   foreignKey: 'user_id',
//   constraints: false
// });


// rooms.belongsToMany(user, {
//   through: {
//     model: room_request,
//     unique: false
//   },
//   foreignKey: 'room_id',
//   constraints: false
// });