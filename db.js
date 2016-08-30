var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';

var sequelize;
if(env = 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		'dialect': 'postgress'
	});
	dialect = 'postgres';
}else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': dialect,
		'storage': __dirname + '/data/dev-todoapi.sqlite'
	});
}

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;