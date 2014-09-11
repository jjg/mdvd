var restify = require('restify');
var spawn = require('child_process').spawn;

// init server
var server = restify.createServer();

// init mplayer
var player = spawn('./mplay_title', ['/dev/dvd', '1', '1', '1', 'mplay_title.out']);

// handlers
function processCommand(req, res, next){
	
	// debug
	console.log('received command: ' + req.params.commandName);

	player.stdin.write(req.params.commandName + '\n');

	res.send(200);
	return next();
}

player.stdout.on('data', function(data){
	console.log(data.toString());
});

// endpoints
server.get({path:'/command/:commandName', version:'1.0.0'}, processCommand);

// static content
server.get(/\/player\/?.*/, restify.serveStatic({
	directory:'./static'
}));

// start the api server
var port = process.env.port || 5001;
server.listen(port, function(){
	console.log('%s listening at ', server.name, server.url);
});
