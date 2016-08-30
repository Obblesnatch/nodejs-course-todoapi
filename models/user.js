var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, dataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: dataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: dataTypes.STRING
		},
		password_hash: {
			type: dataTypes.STRING
		},
		password: {
			type: dataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [8, 55]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPass = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPass);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function(type) {
				if(!_.isString(type)) {
					console.log('No token type defined');
					return undefined;
				}

				try {
					var uData = JSON.stringify({
						id: this.get('id'),
						type: type
					});
					var encryptedData = cryptojs.AES.encrypt(uData, 'abc123!@#').toString();
					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty123098');
					return token;
				} catch(err) {
					console.log(err);
					return undefined;
				}
			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject();
					}

					user.findOne({
						where: {
							email: body.email,
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}
						resolve(user);
					}, function(err) {
						reject();
					});
				});
			}
		}
	});
	return user;
}