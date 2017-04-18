const keys = require("./keys.js");
const request = require("request");
const twitter = require("twitter");
const spotify = require("spotify");
const inquirer = require("inquirer");
const fs = require("fs");
const liri = require("./liri.js");


var command = process.argv[2];


// console.log(twitterKeys.consumer_key);

console.log(command);

if (command == 'my-tweets') {

    myTweets();

} else if (command == 'spotify-this-song') {
    var userInput = process.argv;
    var song = "";
    for (var i = 3; i < userInput.length; i++) {
        song += (userInput[i] + " ");
    }
    // song.join(" ");
    song.trim();
	spotifyThisSong(song);

} else if (command == 'movie-this') {
    // Store all of the arguments in an array
    var nodeArgs = process.argv;

    // Create an empty variable for holding the movie name
    var movieName = "";

    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {

            movieName = movieName + "+" + nodeArgs[i];

        } else {

            movieName += nodeArgs[i];

        }
    }

	movieIt(movieName);

} else if (command == 'do-what-it-says') {

    doWhatItSays();

} else {
    console.log("Please, enter a valid command!!");
}

//The log file
fs.appendFile("log.txt",command + ", ");


function myTweets(){
	var client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret

    });
    var params = { screen_name: 'Diaeddin_Motan' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {

            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweet number " + i + " " + tweets[i].text);
                console.log("Created at: " + " " + tweets[i].created_at);
            }
        } else {
            console.log(err);
        }
    });
}

function spotifyThisSong(song){
	
    // console.log(song);
    // console.log(song);
    //song not entered
    if (song == null) {
        //default values
        song = "The Sign";
        var artist = "Ace of Base";

        spotify.search({ type: 'track', query: song }, function(err, data) {
            if (!err) {

                for (var i = 0; i < data.tracks.items.length; i++) {

                    if (data.tracks.items[i].artists[0].name == artist) {
                        console.log(i);
                        console.log("Song Name: " + data.tracks.items[i].name);
                        console.log("Artist: " + data.tracks.items[i].artists[0].name);
                        console.log("Album Name: " + data.tracks.items[i].album.name);
                        break;
                    }


                }

            } else {
                console.log(err);
            }
        });

    } else {
        spotify.search({ type: 'track', query: song }, function(err, data) {
            if (!err) {
                // console.log(song);
                // console.log(data);
                for (var i = 0; i < data.tracks.items.length; i++) {

                    // if(data.tracks.items[i].name == song){
                    // console.log(i);
                    console.log("Artist: " + data.tracks.items[i].artists[0].name);
                    console.log("Song Name: " + data.tracks.items[i].name);
                    console.log("Preview Link: " + data.tracks.items[i].external_urls.spotify);
                    console.log("Album Name: " + data.tracks.items[i].album.name);
                    // }
                }

            } else {
                console.log(err);
            }
        });
    }
}

function movieIt(movieName){
	if (movieName == "") {
        movieName = "Mr. Nobody";
    }
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true";

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
            
            // console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Country);
            // console.log("Rotten Tomatoes URL: " + JSON.parse(body).Country);
        }
    });
}

function doWhatItSays(){

    fs.readFile("random.txt", "utf8", function(error, data) {

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        if(dataArr[0] == "my-tweets"){
        	myTweets();
        }
        else if(dataArr[0] == "spotify-this-song"){
        	spotifyThisSong(dataArr[1]);
        }
        else if(dataArr[0] == "movie-this"){
        	movieIt(dataArr[1]);
        }



    });
}
