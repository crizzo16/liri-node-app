require("dotenv").config();
let keys = require("./keys.js");
let request = require("request");
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);
let Twitter = require("twitter");
let client = new Twitter(keys.twitter);
let fs = require("fs");
let input = process.argv[2]; // the command that the user wants to execute

// This will list all the command possibilities in case you forget
if (input === "help") {
    console.log("\n***** Commands *****");
    console.log("Items in <> are optional.")
    console.log("* my-tweets <username>");
    console.log("* spotify-this-song <song title>");
    console.log("* movie-this <movie title>");
    console.log("* do-what-it-says\n");;
}
// This will show your last 20 tweets and when they were created
else if (input === "my-tweets") {
    console.log("\n********************");
    console.log("LAST 20 TWEETS");
    console.log("********************\n");
    let username = "criticalrole";
    // If the user specifies an account, change it to that account
    if (process.argv[3]) username = process.argv[3];
    logTweets(username);
}
// This will take in a song name and show some information about the song
else if (input === "spotify-this-song") {
    console.log("\n********************");
    console.log("SEARCHING FOR SONG ON SPOTIFY");
    console.log("********************\n");

    // Rickroll the user if they don't enter a song title
    let song_title = "never+gonna+give+you+up";
    // If the user doesn't enter a multi-word title in quotes, grab the full title
    if (process.argv.length > 3) {
        song_title = "";
        song_title = process.argv[3];
        for (let i = 4; i < process.argv.length; i++) {
            song_title += " " + process.argv[i];
        }
    }
    // Search for the song
    spotifySong(song_title);
}
// This will show information about a movie
else if (input === "movie-this") {
    console.log("\n********************");
    console.log("SEARCHING FOR MOVIE");
    console.log("********************\n");

    //If the user doesn't enter a title
    let movieName = "incredibles+2";
    // If the user does't enter a multi-word title in quotes, grab the full title
    if (process.argv.length > 3) {
        movieName = "";
        movieName = process.argv[3];
        for (let i = 4; i < process.argv.length; i++) {
            movieName += "+" + process.argv[i];
        }
    }
    // Grab the movie
    getMovie(movieName);

} else if (input === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (err, data) {
        //Check for any errors
        if (err) {
            return console.log(err);
        }

        // Put the random options into an array
        let random = data.split(",");
        // Grab an even number option (the command)
        let num = 2 * Math.floor(Math.random() * (random.length / 2));
        // Checking to make sure number is even (debugging)
        //console.log('length: ' + random.length);
        //console.log("num: " + num);

        // Do the appropriate function based on the command
        if (random[num] === "spotify-this-song") {
            spotifySong(random[num + 1]);
        }
        else if (random[num] === "movie-this") {
            getMovie(random[num + 1]);
        }
    });
} else {
    console.log("That is not a command. Use the command 'help' to see a list of all the commands.");
}

function logTweets(username) {
    // Set username
    let params = { screen_name: username };
    // Get the tweets
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            // Loop through the first 20 tweets
            for (let i = 0; i < 20; i++) {
                // If the tweet exists (aka if the user has less than 20 tweets)
                if (tweets[i]) {
                    console.log("\n" + tweets[i].created_at);
                    console.log("--------------------");
                    console.log(tweets[i].text + "\n");
                }
            }
        }
    });
};


/**
 * This function searches for a song based on the title and logs it to the console
 * @param {String} title The title of the song
 */
function spotifySong(title) {
    spotify.search({ type: "track", query: title }, function (err, data) {
        if (err) {
            return console.log("Spotify Error: " + err);
        }

        // Log the relevant info to the console
        console.log("\n***** " + data.tracks.items[0].name + " *****");
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Preview Song: " + data.tracks.items[0].external_urls.spotify + "\n");

        // Log song title to log.txt
        logData("spotify-this-song", data.tracks.items[0].name);
    });



}

/**
 * Grabs info for a movie based on the title and displays it in the console.
 * @param {String} movie_title The title of the movie
 */
function getMovie(movie_title) {
    let queryURL = "http://www.omdbapi.com/?t=" + movie_title + "&y=&plot=short&apikey=trilogy";


    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //Debugging the JSON response
            //console.log(JSON.parse(body));

            let movie = JSON.parse(body);
            //Only print a field if it exists
            console.log("\n***** " + movie.Title + " *****");
            console.log(movie.Plot);
            console.log("Starring: " + movie.Actors);
            console.log("Released: " + movie.Year);
            if (movie.Country) {
                console.log("Country: " + movie.Country);
            }
            if (movie.Language) {
                console.log("Language(s): " + movie.Language);
            }
            if (movie.imdbRating) {
                console.log("IMDB rating: " + movie.imdbRating);
            }
            if (movie.Ratings && movie.Ratings[1]) {
                console.log("Rotten Tomatoes rating: " + movie.Ratings[1].Value);
            }
            console.log("");

            // Log movie title to log.txt
            logData("movie-this", movie.Title);
        }
    });
}

/**
 * Logs the basic function of the data in a separate log.txt file
 * @param {String} command The command the user executed
 * @param {String} data The title of the movie/song or the first tweet
 */
function logData(command, data) {
    let content = "\n" + command + ": " + data;

    fs.appendFile("log.txt", content, function (err) {
        if (err) {
            console.log("Error logging content to log.txt");
            console.log(err);
        }
    });
}
