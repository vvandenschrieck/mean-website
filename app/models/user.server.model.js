var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

/*
 *	Définition de l'objet UserSChema sur base du constructuer Scheam 	
 */
var UserSchema = new Schema({
	firstName: String,
	lastName: String, 
	email: {
		type: String, 
		match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
	}, 
	username: {
		type: String, 
		unique: true, 
		required: 'Username is required',
		trim: true
	},
	password: {
		type : String, 
		validate: [
			function(password){
				return password && password.length >6;
			}, 'Password should be longer'
		]
	}, 
	salt: {
		type: String
	}, 
	provider: {
		type: String, 
		required: 'Provider is required'
	},
	providerId: String, 
	providerData: {}, 
	
	created: {
		type: Date, 
	default: Date.now
	}
});

/*
 * Appel à la méthode virtual qui enregistre un nouvel attribut fullname et définit les callbacks get/set
 */ 
UserSchema.virtual('fullName')
	.get(function() {
  	  	return this.firstName + ' ' + this.lastName;
	})
	.set(function(fullName) {
  	  	var splitName = fullName.split(' ');
  		this.firstName = splitName[0] || '';
  	  	this.lastName = splitName[1] || '';
	});

/*
 * Appel à la méthode pre de l'objet UserSchema qui enregistre une callback (middleware) à appeler avant l'opération save
 */
UserSchema.pre('save', 
	function(next) {
	  	if (this.password) { // L'objet User contient un password, toujours en clair : On le hache
			this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
			this.password = this.hashPassword(this.password);
	  	}
		next(); 
	}
);
/*
 * Ajout d'une méthode hashPassword 
 * Chiffre le mot de passe sur base du salt enregistré comme variable d'instance
 */


UserSchema.methods.hashPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000,64).toString('base64');
};

/* 
 * Cette méthode vérifie les credentials et renvoie un boolean 
 */

UserSchema.methods.authenticate = function(password) {
  	return this.password === this.hashPassword(password);
};


/*
 * Méthode statique, permet de trouver un utilisateur en particulier
 */ 
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
     var _this = this;
     var possibleUsername = username + (suffix || '');
     _this.findOne(
		 {username: possibleUsername}, 
		 function(err, user) {
       	  	if (!err) {
         	   if (!user) {
           		   callback(possibleUsername);
         	  	} else {
           		 	return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
				}
      	  	} else {
        		callback(null);
			} 
		 }
	 );
};

/*
 * Force l'application des getters/setters lors de la conversion en json
 */ 
UserSchema.set('toJSON', {
     getters: true,
     virtuals: true
});

/* Création du modèle User sur base du Schéma UserSchema */
mongoose.model('User', UserSchema);