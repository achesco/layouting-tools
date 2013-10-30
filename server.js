var express = require('express')
	, http = require('http')
	;

var app = express();

// Emulating sourceMapPrefix option. The number of directories to drop
// from the path prefix when declaring files in the source map.
var cssSourceMapPrefix = 2;
app.use(function (req, res, next) {
	var uris = req.url.split('/');
	// Customize conditions to meet your requirements
	if (uris.length > cssSourceMapPrefix && uris[cssSourceMapPrefix+1] == 'css') {
		var url = '/' + uris.splice(cssSourceMapPrefix+1).join('/');
		console.log('CSS source map prefix rewrite from ' + req.url + ' to ' + url);
		res.redirect(url);
	}
	else {
		next();
	}
});

// Setting up static folders
app.use(express.static('html'));

// Running HTTP-server
http.createServer(app).listen('8080', function () {
	console.log("Express server listening on port 8080");
});

