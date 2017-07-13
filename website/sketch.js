// POEM PART
var lines; 
var socket;
var p;
var twitterLogo;

function setup() {
	noCanvas();
	console.log("it's working!");

	lines = loadStrings("poem.txt", poem);

    //socket = io('http://localhost:3000');
    socket = io.connect('http://localhost:3000');


	socket.on('tweeted', function(data){
	   console.log(data);

	   //THIS REPLACES A RANDOM LINE
	   var newps = selectAll('.retro');
	   var newp = random(newps);

	   newp.html('<img src="twitterBird.svg" alt="" style = "width: 25px">' + data);
	   //newp.html('<img src="twitterBird.svg" alt="" style = "width: 25px">' + data + '<p>@ifIWereABot </p>');
	   newp.class('tweetAdd');
	   newp.style('color', ' #3287E3');


	   var allp = selectAll('.retro');
	   var poemtxt = '';
	   for (var i = 0; i < allp.length; i++) {
	   	 poemtxt += allp[i].html() + '\n';
	   }
	   console.log(poemtxt);

	   socket.emit('save', poemtxt);

	});
}

function poem() {
	console.log(lines);

	var grabText = select("#poemContainer");
	for (var i = 0; i<lines.length; i++) {
		p = createP(lines[i]);
		p.class('retro');
		p.parent(grabText);
	}
}