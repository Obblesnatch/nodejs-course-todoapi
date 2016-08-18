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
	var query = req.query;
	var filtered = todos;

	var search = {};
	if(query.hasOwnProperty('completed')) {
		if(query.completed === 'true') {
			search.completed = true;
		}else if(query.completed === 'false') {
			search.completed = false;
		}
	}

	filtered = _.where(filtered, search);

	if(filtered.length > 0 && query.hasOwnProperty('q') && query.q.length > 0) {
		var description = decodeURIComponent(query.q).toLowerCase();
		filtered = _.filter(filtered, function(todo) {
			if(todo.description.toLowerCase().indexOf(description) === -1){
				return 0; 
			}else {
				return 1;
			}
		})
	}


	res.json(filtered);
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
	if(matched) {
		todos = _.without(todos, matched);
		res.json(matched);
	}else {
		res.status(404).json({"error": "No todo found with that ID"});
	}
});

app.put('/todos/:id', function(req, res) {
	var requested = parseInt(req.params.id);
	var matched = _.findWhere(todos, {id: requested});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if(!matched) {
		return res.status(404).json({"error": "No todo found with that ID"});
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description.trim();
	}else if(body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matched, validAttributes);

	res.json(matched);
});



app.listen(PORT, function() {
	console.log('Todo API Server started on port '+PORT);
});