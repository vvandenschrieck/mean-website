var ctrl = require('../../app/controllers/users.server.controller'), 
	passport = require('passport');

module.exports = function(app){
	app.route('/signup')
		.get(ctrl.renderSignup)
		.post(ctrl.signup);
	
	app.route('/signin')
		.get(ctrl.renderSignin)
		.post(
			passport.authenticate('local', {
          	  	successRedirect: '/',
          	  	failureRedirect: '/signin',
          	  	failureFlash: true, 
				successFlash: 'Welcome!'
			})
		);
	
	app.get('/signout', ctrl.signout);
	
	// app.route('/users')
	// 	.post(ctrl.create)
	// 	.get(ctrl.list);
	//
	// app.route('/users/:userID')
	// 	.get(ctrl.read)
	// 	.put(ctrl.update)
	// 	.delete(ctrl.delete);
	//
	// app.param('userID', ctrl.userByID);
};

