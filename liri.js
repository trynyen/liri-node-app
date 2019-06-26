//Require packages
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("node-moment");
var fs = require("fs");
var chalk = require("chalk");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


//Setting action, switching functions, and calling function
var action = process.argv[2];
var searchQuery = process.argv.slice(3).join(" ");
commands(action, searchQuery);

function commands(action, searchQuery) {
    switch (action) {

        case "concert-this":
            concert(searchQuery);
            break;

        case "spotify-this-song":
            spotifySong(searchQuery);
            break;

        case "movie-this":
            movie(searchQuery);
            break;

        case "do-as-it-says":
            showInfo();
            break;

    }
}

//Bands in town search
function concert(concertSearch) {

    axios.get("https://rest.bandsintown.com/artists/" + concertSearch + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log(chalk.cyanBright.bold("------------------------------------------------------------"));
                console.log(chalk.magentaBright("Artist: ") + response.data[i].lineup);
                console.log(chalk.magentaBright("Venue: ") + response.data[i].venue.name + ", " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                var date = moment(response.data[i].datetime, '"YYYY-MM-DDTkk-mm-ss"').format("MM/DD/YYYY");
                console.log(chalk.magentaBright("Date: ") + date);
                console.log(chalk.cyanBright.bold("------------------------------------------------------------"));
            }
        }
        )
}

//Spotify search
function spotifySong(trackSearch) {

    //If track data not entered, track is set to default
    if (trackSearch == undefined || null) {
        trackSearch = "The Sign Ace of Base";
    }

    //Otherwise, search for track
    spotify.search({
        type: "track",
        query: trackSearch,
        limit: 10,
    }, function (err, data) {
        if (err) {
            return console.log(err);
        }
        var trackDetails = data.tracks.items;
        for (var i = 0; i < trackDetails.length; i++) {
            console.log(chalk.cyan.bold("------------------------------------------------------------"));
            console.log(chalk.blueBright("Artist(s): ") + trackDetails[i].artists[0].name);
            console.log(chalk.blueBright("Song: ") + trackDetails[i].name);
            console.log(chalk.blueBright("Preview track: ") + trackDetails[i].preview_url);
            console.log(chalk.blueBright("Album: ") + trackDetails[i].album.name);
            console.log(chalk.cyan.bold("------------------------------------------------------------"));
        }
    }
    )
}

//OMDB search
function movie(movieSearch) {

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
                        return this.Value;
                    }

                    else {
                        return "Rotten Tomatoes Rating is not available";
                    }
                })
            }

            //Log Movie Details
            console.log(chalk.magentaBright.bold("------------------------------------------------------------"));
            console.log(chalk.cyan("Movie title: ") + response.data.Title);
            console.log(chalk.cyan("Year: ") + response.data.Year);
            console.log(chalk.cyan("imdb rating: ") + response.data.imdbRating);
            console.log(chalk.cyan("Rotten Tomatoes rating: ") + rottenTomatoesRating());
            console.log(chalk.cyan("Country: ") + response.data.Country);
            console.log(chalk.cyan("Language: ") + response.data.Language);
            console.log(chalk.cyan("Plot: ") + response.data.Plot);
            console.log(chalk.cyan("Cast: ") + response.data.Actors);
            console.log(chalk.magentaBright.bold("------------------------------------------------------------"));
        },
        )
};

//Do as it says function based on random.txt
function showInfo() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        var dataArr = data.replace(/"/,"").split(",");
        commands(dataArr[0], dataArr[1]);
    })
}
