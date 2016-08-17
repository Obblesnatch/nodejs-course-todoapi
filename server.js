var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res) {
	res.send('Todo API Route');
});

app.listen(PORT, function() {
	console.log('Todo API Server started on port '+PORT);
});