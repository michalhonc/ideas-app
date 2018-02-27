const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Get Idea DB schema
const UserModel = require('../models/User');

// Connect to mongoose
// mongoose.connect('mongodb://localhost/ideas-dev')
// .then(() => console.log('mongodb connected'))
// .catch(err => console.log('mongodb err: ' + err));

router.get('/login', (req, res) => {
	res.render('users/login')
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/ideas',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

router.get('/register', (req, res) => {
	res.render('users/register')
});

router.post('/register', (req, res) => {
	let errors = [];

	if(req.body.password != req.body.password2) {
		errors.push({text: 'Passwords do not match!'});
	}
	if(req.body.password.length < 4) {
		errors.push({text: 'Password is too short!'});
	}
	if(errors.length > 0) {
		res.render('users/register', {
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			password2: req.body.password2
		})
	} else {
		UserModel.findOne({email: req.body.email})
			.then(user => {
				if(user) {
					errors.push({text: 'Email already registered'});
					res.render('users/login', {
						errors: errors
					});
				} else {
					const newUser = new UserModel({
						name: req.body.name,
						email: req.body.email,
						password: req.body.password
					})

					bcrypt.genSalt(10, (err, salt) => {
			            bcrypt.hash(newUser.password, salt, (err, hash) => {
			              if(err) throw err;
			              newUser.password = hash;
			              newUser.save()
			                .then(user => {
			                	res.redirect('/users/login');
			                })
			                .catch(err => {
			                	console.log(err);
			                	return;
			                });
			            });
			        });
				}
			})

	}

});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are log out');
	res.redirect('/users/login');
})

module.exports = router;