var express = require('express');
var bodyParser = require('body-parser');

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
	var matched = null;
	var requested = parseInt(req.params.id);

	todos.forEach(function(todo) {
		if(todo.id == requested) {
			matched = todo;
		}
	});
	if(matched) {
		res.json(matched);
	}else {
		res.status(404).send();
	}
});

app.post('/todos', function(req, res) {
	var body = req.body;
	body.id = incrementId++;
	todos.push(body);
	res.send(body);
});

app.listen(PORT, function() {
	console.log('Todo API Server started on port '+PORT);
});