var users = require('../../app/controllers/users.server.controller'), 
	passport = require('passport');

module.exports = function(app){
	app.route('/signup')
		.get(users.renderSignup)
		.post(users.signup);
	
	app.route('/signin')
		.get(users.renderSignin)
		.post(
			passport.authenticate('local', {
          	  	successRedirect: '/',
          	  	failureRedirect: '/signin',
          	  	failureFlash: true, 
				successFlash: 'Welcome!'
			})
		);
	
	app.get('/signout', users.signout);
	
	app.route('/users')
		.post(users.create)
		.get(users.list);

	app.route('/users/:userID')
		.get(users.read)
		.put(users.update)
		.delete(users.delete);
		
	app.param('userID', users.userByID);
}

