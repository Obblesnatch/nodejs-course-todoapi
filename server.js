var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var incrementId = 1;

app.use(bodyParser.json());


app.get('/', function(req, res) {
	res.send('Todo API Route');
});

app.get('/todos', function(req, res) {
	var query = req.query;
	var search = {};
	if (query.hasOwnProperty('completed')) {
		if (query.completed === 'true') {
			search.completed = true;
		} else if (query.completed === 'false') {
			search.completed = false;
		}
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		search.description = {
			$like: '%' + decodeURIComponent(query.q).toLowerCase() + '%'
		};
	}

	db.todo.findAll({
		where: search
	}).then(function(todos) {
		res.json(todos);
	}, function(err) {
		res.status(500).json(err);
	});
});

app.get('/todos/:id', function(req, res) {
	var requested = parseInt(req.params.id);

	db.todo.findById(requested).then(function(todo) {
		if (todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send('No todo exists with this ID');
		}
	}, function(err) {
		res.status(500).json(err);
	});
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	var response = {};
	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(err) {
		res.status(400).json(err);
	});
});

app.delete('/todos/:id', function(req, res) {
	var requested = parseInt(req.params.id);

	db.todo.destroy({
		where: {
			id: requested
		}
	}).then(function(num) {
		if (num === 0) {
			res.status(404).send();
		} else {
			res.send('Deleted ' + num + ' todo(s)');
		}
	}, function(err) {
		res.status(500).json(err);
	});
});

app.put('/todos/:id', function(req, res) {
	var requested = parseInt(req.params.id);
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (body.hasOwnProperty('completed')) {
		validAttributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		validAttributes.description = body.description.trim();
	}

	db.todo.findById(requested).then(function(todo) {
		if (todo) {
			todo.update(validAttributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(err) {
				res.status(400).json(err);
			});
		} else {
			res.status(404).send()
		}
	}, function(err) {
		res.status(500).send();
	});
});


app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	var response = {};
	db.user.create(body).then(function(user) {
		res.json(user.toJSON());
	}, function(err) {
		res.status(400).json(err);
	});
});


db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Todo API Server started on port ' + PORT);
	});
});