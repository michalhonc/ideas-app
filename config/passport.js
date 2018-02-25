const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserModel = mongoose.model('users');

module.exports = function(passport) {
	passport.use(new LocalStrategy({usernameField: 'email'},
		(email, password, done) => {
			console.log(email);
		}));
}