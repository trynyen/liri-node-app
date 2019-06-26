require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
// var moment = require("moment-js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

//Setting action and calling functions
var action = process.argv[2];

if (action === "concert-this") {
    concert();
}
else if (action === "spotify-this-song") {
    spotifySong();
}
else if (action === "movie-this") {
    movie();
}

//Bands in town search
function concert() {
    var artistSearch = process.argv.slice(3).join(" ");

    if (artistSearch == undefined || null) {
        artistSearch = "Bruno Mars";
    }

    axios.get("https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < response.length; i++) {
                console.log("------------------------------------------------------------");
                console.log("Artist: " + response[i].lineup);
                console.log("Venue: " + response[i].venue.name + ", " + response[i].venue.city + ", " + response[i].venue.country);
                console.log("Date: " + response[i].datetime);
                console.log("------------------------------------------------------------");
            }
        }
        )
}

//Spotify search
function spotifySong() {
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
function movie() {
    var movieSearch = process.argv.slice(3).join(" ")

    if (movieSearch == undefined || null) {
        movieSearch = "The Notebook";
    }


    axios.get("http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {
            //Search for Rotten Tomatoes Ratings
            function rottenTomatoesRating() {
                return response.data.Ratings.find(function (rating) {
                    if (rating.Source === "Rotten Tomatoes") {
                        return rating.Value;
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


