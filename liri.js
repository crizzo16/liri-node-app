require("dotenv").config();

let keys = require("./keys.js");

let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

let input = process.argv[2];
// This will show your last 20 tweets and when they were created
if (input === "my-tweets") {

}
// This will take in a song name and show some information about the song
else if (input === "spotify-this-song") {
    let song_title = process.argv[3];
}
// This will show information about a movie
else if (input === "movie-this") {
    let movieName = process.argv[3];
    //Check to see if user put movie name in quote or not
    for (let i = 4; i < process.argv.length; i++) {
        movieName += "+" + process.argv[i];
    }
    let queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";


    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(JSON.parse(body));
            // ***TODO: format response ***
            // Needs: Title, Release Year, IMDB rating, Rotten Tomatoes rating, Country, Language, Plot, Actors
        }
    });
} else if (input === "do-what-it-says") {

}