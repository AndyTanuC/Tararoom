var Sequelize = require('sequelize');
const db = require('../db');

var Room = db.define('rooms', {
    id: { 
    	autoIncrement: true,
    	primaryKey: true,
    	type: Sequelize.INTEGER
    },
    name: {
    	type: Sequelize.STRING,
    	notEmpty: true
    }
});

module.exports = Room;