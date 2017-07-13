//WEBSOCKETS PART
// HTTP Portion
//below is secure server code
var https = require('https'); // we will be using secure server
var fs = require('fs'); // Using the filesystem module
var url =  require('url');

var express = require('express');
// Create the app
var app = express();

// Set up the server
var server = app.listen(3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('website'));

//WEBSOCKET PORTION
// WebSockets work with the HTTP server
var io = require('socket.io')(server);


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
		console.log("Working!");

    socket.on('save', function (data) {
      console.log ("data i got:" + data);

      var today = new Date();

      //save video separately
      fs.writeFile(__dirname + '/poems/' + today, data, function(err){
        if (err) console.log(err);
        console.log("Text is saved!");
        });
    });

	}
);

// TWITTER PART
// Using the Twit node package
// https://github.com/ttezel/twit

var Twit = require('twit');

// Pulling all my twitter account info from another file
var config = require('./config.js');

// Making a Twit object for connection to the API
var T = new Twit(config);

console.log('connection established');

// Setting up a user stream
var stream = T.stream('user', { with: 'user' });

//SET UP FOR LOOKING FOR HASHTAG
//search for this phrase
var phrase = '#homeNotHome';
var regex = /#homeNotHome/ig;

//create a function to look for a phrase
var stream = T.stream('statuses/filter', { track: phrase });
stream.on('tweet', foundTweet);

function foundTweet(tweet) {
  if(regex.test(tweet.text) && tweet.user.screen_name !== 'whereishomeha') {
    console.log('Tweet coming in: ' + tweet.id_str + ' ' + ' ' + tweet.user.screen_name + ' ' + tweet.text);

    T.post('statuses/retweet', { id: tweet.id_str }, retweeted);

    var tweet = tweet.text;
    // var name = tweet.user.screen_name;
    // console.log("name is: " + name);

    // var dataObject = {
    //   txt: tweet,
    //   // user: name
    // }

    // console.log("data object is:" + dataObject);

    io.sockets.emit('tweeted', tweet);

    function retweeted(err, data, response) {
      if (err) {
        console.log("Error: " + err.message);
      } else {
        console.log('Retweeted: ' + tweet.id_str);
      }
    }
  }
}