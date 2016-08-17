var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Get the food',
	completed: false
},{
	id: 2,
	description: 'Pickup the dog from school',
	completed: false
},{
	id: 3,
	description: 'Learn to canoe',
	completed: true
}];

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

app.listen(PORT, function() {
	console.log('Todo API Server started on port '+PORT);
});