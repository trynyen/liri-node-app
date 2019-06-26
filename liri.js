//Require packages
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("node-moment");
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

    axios.get("https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("------------------------------------------------------------");
                console.log("Artist: " + response.data[i].lineup);
                console.log("Venue: " + response.data[i].venue.name + ", " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                var date = moment(response.data[i].datetime, '"YYYY-MM-DDTkk-mm-ss"').format("MM/DD/YYYY");
                console.log("Date: " + date);
                console.log("------------------------------------------------------------");
            }
        }
        )
}

//Spotify search
function spotifySong() {
    var trackSearch = process.argv.slice(3).join(" ");

    //If track data not entered, track is set to default
    if (trackSearch == undefined || null) {
        trackSearch = "The Sign";
    }

    //Otherwise, search for track
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

    //If movie data not entered, movie is set to default
    if (movieSearch == undefined || null) {
        movieSearch = "Mr. Nobody";
    }

    //Otherwise, get movie details
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


