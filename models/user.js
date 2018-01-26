const Sequelize = require('sequelize');
var bcrypt 	= require('bcryptjs');
const db = require('../db');

var User = db.define('users', {
    id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    username: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    admin: {
    	type: Sequelize.BOOLEAN,
    	allowNull: true,
    	default: false
    }
}, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }    
});

module.exports = User;