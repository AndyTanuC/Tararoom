var Sequelize = require('sequelize');
var bcrypt 	= require('bcryptjs');
const db 	= require('../db');

var sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/taralite');

var User = sequelize.define('users', {
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

sequelize.sync();

module.exports = User;