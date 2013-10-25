var express = require('express')
	, http = require('http')
	;

var app = express();

// Setting up static folders
app.use(express.static('html'));

// Running HTTP-server
http.createServer(app).listen('8080', function () {
	console.log("Express server listening on port 8080");
});
