var restify = require('restify');
var spawn = require('child_process').spawn;

// config
var baseImagePath = '/home/jason/Media/';
var mediaPath = '/dev/dvd'; //'/home/jason/media/Bonnevilleproject/'; //'/dev/dvd';  //'/media/removable/UNTITLED/Cosmos S1 D1/';

// init server
var server = restify.createServer();
server.use(restify.bodyParser({ mapParams: false }));

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
        		player = spawn('./mplay_title', [mediaPath, '1', '2', '1', 'mplay_title.out']);
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

function play(req, res, next){

	// extract params
	var title = req.params.title;
	var chapter = req.params.chapter;
	var angle = req.params.angle;

	// debug
	console.log('play');

	console.log('title: ' + title);
	console.log('chapter: ' + chapter);
	console.log('angle: ' + angle);

	// stop the player if necissary
	if(player){

		console.log('looks like player is running, attempting to kill');

		player.on('exit', function(){

			console.log('existing player killed');

			startNewPlayer();

			res.send('new player started');
			return next();

		});

        // debug
        console.log('killing existing player');

        player.kill();
        player = null;

	} else {
		startNewPlayer();
	}

	function startNewPlayer(){

		console.log('starting new player');

		// play the specified title
		player = spawn('./mplay_title', [mediaPath, title, chapter, angle, 'mplay_title.out']);

		res.send('mplay_title started');
		return next();

		
		player.stderr.on('data', function(data){

			console.log(data.toString());

			/*
			if(data.toString() === 'streaming'){
				res.send('playing selection');
				return next();
			}
			*/

		});
		
	}
}

function getTitles(req, res, next){

	var titleInfo = spawn('./title_info', [mediaPath]);
	var chunk = '';

	titleInfo.stdout.on('data', function(data){

		chunk = chunk +  data.toString();

	});

	titleInfo.on('exit', function(){

		// debug
		console.log('got end');

		var titleInfoObject = JSON.parse(chunk);		
	
		res.send(titleInfoObject);
	
		return next();

	});
}

function loadImage(req, res, next){

	var imageName = req.body.imagename;

	mediaPath = baseImagePath + imageName + '/';

	// debug
	console.log('loading ' + mediaPath);

	res.send('image loaded');
	return next();

}

// endpoints
server.get({path:'/command/:commandName', version:'1.0.0'}, processCommand);
server.get({path:'/titles', version:'1.0.0'}, getTitles);
server.get({path:'/play/:title/:chapter/:angle', version:'1.0.0'}, play);

// this method only used for testing with dvd images
server.post({path:'/load', version:'1.0.0'},loadImage);

// static content
server.get(/\/player\/?.*/, restify.serveStatic({
	directory:'./static'
}));

// start the api server
var port = process.env.port || 5000;
server.listen(port, function(){
	console.log('%s listening at ', server.name, server.url);
});
