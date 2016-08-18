var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var incrementId = 1;

app.use(bodyParser.json());


app.get('/', function(req, res) {
	res.send('Todo API Route');
});

app.get('/todos', function(req, res) {
	res.json(todos);
});

app.get('/todos/:id', function(req, res) {
	var requested = parseInt(req.params.id);

	var matched = _.findWhere(todos, {id: requested});

	if(matched !== undefined) {
		res.json(matched);
	}else {
		res.status(404).send();
	}
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim();
	body.id = incrementId++;
	todos.push(body);
	res.send(body);
});

app.delete('/todos/:id', function(req, res) {
	var requested = parseInt(req.params.id);

	var matched = _.findWhere(todos, {id: requested});
	console.log(todos);
	console.log(requested);
	console.log(matched);
	if(matched) {
		todos = _.without(todos, matched);
		res.json(matched);
	}else {
		res.status(404).json({"error": "No todo found with that ID"});
	}
});

app.listen(PORT, function() {
	console.log('Todo API Server started on port '+PORT);
});