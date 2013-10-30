var express = require('express')
	, http = require('http')
	;

var app = express();

// Emulating sourceMapPrefix option, for css source maps.
var cssSourceMapPrefix = 2;
app.use(function (req, res, next) {
	var uris = req.url.split('/');
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


//
//app.use(function(req, res, next){
//	check if req.url is of '/blog/*
//	if(req.url.indexOf(/blog/) > -1){
//		// then grab the last part and redirect it
//		var postId = (req.url.split("/")[2] || "")
//		req.url = '/posts/' + postId + '.html';
//	}
//	next()
//})
