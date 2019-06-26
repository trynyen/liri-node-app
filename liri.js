require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


//Spotify search
if (process.argv[2] == "spotify-this-song") {
    var trackSearch = process.argv.slice(3).join(" ");

    if (trackSearch == undefined || null) {
        trackSearch = "Aggretsuko Theme";
    }

    spotify.search({
        type: "track",
        query: trackSearch,
        limit: 1,
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        var trackDetails = data.tracks.items;
        for (var i = 0; i < trackDetails.length; i++) {
            console.log("------------------------------------------------------------");
            console.log("Artist(s): " + trackDetails[i].artists[0].name);
            console.log("Song: " + trackDetails[i].name);
            console.log("Preview track: " + trackDetails[i].preview_url);
            console.log("Album: " + trackDetails[i].album.name);
            console.log("------------------------------------------------------------");
        }
    }
    )
}

//OMDB search
else if (process.argv[2] == "movie-this") {
    var movieSearch = process.argv.slice(3).join(" ")


    axios.get("http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            //Search for Rotten Tomatoes Ratings
            function rottenTomatoesRating() {
                response.data.Ratings.find(function (rating) {
                    if (rating.Source === "Rotten Tomatoes") {
                        return rating.Source.Value;
                    }
                    else {
                        return "Rotten Tomatoes Rating is not available";
                    }
                })
            }

            //Log Movie Details
            console.log("Movie title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("imdb rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes rating: " + rottenTomatoesRating());
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Cast: " + response.data.Actors);
        },
    )
};


