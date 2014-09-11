var restify = require('restify');
var spawn = require('child_process').spawn;

// init server
var server = restify.createServer();

// init mplayer
var player = null;

// handlers
function processCommand(req, res, next){
	
	// debug
	console.log('received command: ' + req.params.commandName);

	switch(req.params.commandName){
		case 'play':
			// play the disc
 			if(!player){
        		player = spawn('./mplay_title', ['/dev/dvd', '1', '2', '1', 'mplay_title.out']);
    		}
			break;

		case 'stop':
			// stop playback if playing
			if(player){
				player.kill();
				player = null;
			}
			break;

		default:
			// who knows?
			console.log('unknown command received');
	}

	//player.stdin.write(req.params.commandName + '\n');

	res.send(200);
	return next();
}
/*
player.stdout.on('data', function(data){
	console.log(data.toString());
});
*/

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
