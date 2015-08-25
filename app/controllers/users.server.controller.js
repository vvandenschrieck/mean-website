//Importation du modèle User et de Passport
var User = require('mongoose').model('User'), 
	passport = require('passport');

/*
 * Génération d'un message d'erreur sur base d'un code ou d'une série de messages
 */
var getErrorMessage = function(err){
	var message = '';
	
	if(err.code){
		switch(err.code){
			case 11000: 
			case 11001: 
				message = 'Username already exists'; 
				break;
			default: 
				message = 'Something went wrong';
		}
	}
	else {
		for (var errName in err.errors){
			//Bizarre : On ne récupère qu'un seul message d'erreur?
			if(err.errors[errName].message) message = err.errors[errName].message;
		}
	}
	return message;
};

/* 
 * Fonction externe renderSignin, vérifie si l'utilisateur est 
 * authentifié (dans ce cas, redirection vers la racine). Sinon, 
 * génération du formulaire de sign in (échec d'authentification)   
 */
exports.renderSignin = function(req, res, next) {
     if (!req.user) {
       	res.render('signin', 
		 	{
        		title: 'Sign-in Form',
         	   	messages: req.flash('error') || req.flash('info')
			}
		);
	} else return res.redirect('/');
	
};

/* 
 * Fonction externe renderSignup, appelée suite à un GET
 * vérifie si l'utilisateur est 
 * authentifié (dans ce cas, redirection vers la racine). Sinon, 
 * génération du formulaire de sign up (échec d'authentification).   
 */
exports.renderSignup = function(req, res, next) {
     if (!req.user) {
       	res.render('signup', 
		 	{
         	   title: 'Sign-up Form',
         	   messages: req.flash('error')
			}
		);
	} else return res.redirect('/');
};
		
/* 
 * Fonction externe signup, appelée suite à un POST
 * gère la création d'un nouvel
 * utilisateur
 */
			
exports.signup = function(req, res, next) {
     if (!req.user) {
     	var user = new User(req.body);
       	var message = null;
       	user.provider = 'local';
		//Sauvegarde du modèle, avec callback  à exécuter
		// après l'opération
       	user.save(function(err) {
	       	if (err) {
	        	var message = getErrorMessage(err);
	           	req.flash('error', message);
	           	return res.redirect('/signup');
	        }
			//Après enregistrement de l'utilisateur, on le logge
	        req.login(user, 
				function(err) {
	           		if (err) return next(err);
	           	 	return res.redirect('/');
		   		}
			); 
		});
     } 
	 else return res.redirect('/');
};

/* 
 * Fonction externe signout, gère la déconnexion
 */

exports.signout = function(req, res) {
     req.logout();
     res.redirect('/');
};

/* 
 * Fonction externe list
 * Récupère la liste de tous les utilisateurs
 */
exports.list = function(req, res, next){
	User.find({}, function(err, myUsers){
		if(err){
			return next(err);
		}
		else{
			res.json(myUsers);
		}		
	});	
}

exports.read = function(req, res){
	res.json(req.user);
}

exports.userByID = function(req, res, next, id){
	User.findOne(
		{_id: id},
		function(err, user){
			if (err){
				return next(err);
			}
			else{
				req.user = user;
				next();
			}
		}
	)
}

exports.create = function(req, res, next){
	var user = new User(req.body);
	user.save(function(err){
		if(err){
			return next(err);
		}
		else{
			res.json(user);
		}
	});
}

exports.update = function(req, res, next){
	User.findByIdAndUpdate(req.user.id, req.body, function(err, user){
		if (err){
			return next(err);
		}
		else{
			res.json(user);
		}	
	});
}

exports.delete = function(req, res, next){
	req.user.remove(function(err){
		if(err) return next(err);
		else res.json(req.user);
	});
}

exports.requiresLogin = function(req, res, next){
	if(!req.isAuthenticated()){
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}
	next();
}