var restify = require('restify');

var server = restify.createServer();

// endpoints

// static content
server.get(/\/player\/?.*/, restify.serveStatic({
	directory:'./static'
}));

var port = process.env.port || 5000;
server.listen(port, function(){
	console.log('%s listening at ', server.name, server.url);
});
