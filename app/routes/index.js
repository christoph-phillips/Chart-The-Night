'use strict';

var path = process.cwd();
var BarHandler = require(path + '/app/controllers/barHandler.server.js');
var PublicBarHandler = require(path + '/app/controllers/publicBarHandler.server.js');

	//AUTH CHECK FUNCTION
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	//OBJECTS WITH METHODS FOR INTERACTING WITH DB
	var barHandler = new BarHandler();
	var publicBarHandler = new PublicBarHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github/')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));


	app.route('/api/:bar?/')
		.get(barHandler.getBars)//get all bar data held on system and populate bar data for that eveni
		.post(barHandler.addBar) //add a new bar for the current evening: add 1 to 1.users and 2.bars
		.delete(barHandler.deleteBar); //remove yourself from a bar - remove bar from 1.users and 2. bars
		
	app.route("/public/api/:bar?")
		.post(publicBarHandler.addPublicBar) //adds one user to specific bar
		.get(publicBarHandler.getPublicBar) //gets data for specific bar on todays date
		.delete(publicBarHandler.deletePublicBar); //removes one user from specific bar
};