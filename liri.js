require("dotenv").config();
var keys = require("./keys.js");
//  require the spotify package
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
var fs = require("fs");

//Spotify search
if (process.argv[2] == "spotify-this-song") {
    var track = process.argv.slice(3).join(" ")
    spotify.search({
        type: "track",
        query: track,
        limit: 1,
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(data.tracks.items[0].name));

    }
    )
}

//OMDB search
if (process.argv[2] == "movie-this") {
    var movie = process.argv.slice(3).join(" ")


    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            // Then we print out the imdbRating

            console.log("Movie title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("imdb rating: " + response.data.imdbRating);

            //Need sto find rotten tomatoes first
            console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Cast: " + response.data.Actors);
        }
    )
};


