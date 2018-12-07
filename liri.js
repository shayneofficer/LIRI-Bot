require("dotenv").config();
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
const keys = require("./keys");

var spotify = new Spotify(keys.spotify);

inquirer.prompt([
    {
        type: "list",
        message: "What would you like to search for?",
        choices: ["Concerts", "Songs", "Movies", "Random"],
        name: "searchChoice"
    }
]).then(function (ans) {
    // Switch Statement Version: 
    switch (ans.searchChoice) {
        case "Concerts":
            getConcerts();
            break;
        case "Songs":
            getSong();
            break;
        case "Movies":
            getMovie();
            break;
        case "Random":
            getRandom();
            break;

        default:
            break;
    }
})

// If/Else Version:
// if (command === "concert-this") {
//     // Do something
// } else if (command === "spotify-this-song") {
//     // Do something
// } else if (command === "movie-this") {
//     // Do something
// } else if (command === "do-what-it-says") {
//     // Do something
// } else {
//     // Do nothing
// }

function getConcerts() {
    inquirer.prompt([
        {
            type: "input",
            message: "What band?",
            name: "band"
        }
    ]).then(function (res) {
        axios.get(`https://rest.bandsintown.com/artists/${res.band}/events?app_id=${keys.bands.id}`).then(function (response) {
            var concertList = "";
            for (var i = 0; i < response.data.length - 1; i++) {
                var concertDate = moment(response.data[i].datetime).format("MM/DD/YYYY");

                concertList += `${response.data[i].venue.name} || ${response.data[i].venue.city} || ${concertDate}\n`
            }
            concertList += `${response.data[response.data.length - 1].venue.name} || ${response.data[response.data.length - 1].venue.city} || ${moment(response.data[response.data.length - 1].datetime).format("MM/DD/YYYY")}`;
            console.log(concertList);
            logData(concertList);
        }).catch(function (err) {
            console.log(err);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function getSong() {
    inquirer.prompt([
        {
            type: "input",
            message: "What song?",
            name: "song"
        }
    ]).then(function (res) {
        spotify.search({
            type: "track",
            query: res.song
        }).then(function (response) {
            var track = response.tracks.items[0];
            var bandName = "";
            for (var i = 0; i < track.artists.length - 1; i++) {
                bandName += `${track.artists[i].name}, `;
            }
            bandName += track.artists[track.artists.length - 1].name;
            console.log(`Artist(s): ${bandName}\nSong Title: ${track.name}\nAlbum Title: ${track.album.name}\nSpotify Link: ${track.external_urls.spotify}`);
            logData(`Artist(s): ${bandName}\nSong Title: ${track.name}\nAlbum Title: ${track.album.name}\nSpotify Link: ${track.external_urls.spotify}`);
        }).catch(function (err) {
            console.log(`Sorry, I couldn't find that song... Here's "The Sign" by Ace of Base instead.`);

            spotify.search({
                type: "track",
                query: "The Sign Ace of Base"
            }).then(function (response) {
                var track = response.tracks.items[0];
                console.log(`Artist(s): ${track.artists[0].name}\nSong Title: ${track.name}\nAlbum Title: ${track.album.name}\nSpotify Link: ${track.external_urls.spotify}`);
                logData(`Artist(s): ${track.artists[0].name}\nSong Title: ${track.name}\nAlbum Title: ${track.album.name}\nSpotify Link: ${track.external_urls.spotify}`);
            }).catch(function (err) {
                console.log("Oh no, something went wrong with that too!");
            });

        });
    }).catch(function (err) {
        console.log(`You didn't enter a song title... Here's "The Sign" by Ace of Base`);
        spotify.search({
            type: "track",
            query: "The Sign Ace of Base"
        }).then(function (response) {
            var track = response.tracks.items[0];
            console.log(`Artist(s): ${track.artists[0].name}\nSong Title: ${track.name}\nAlbum Title: ${track.album.name}\nSpotify Link: ${track.external_urls.spotify}`);
            logData(`Artist(s): ${track.artists[0].name}\nSong Title: ${track.name}\nAlbum Title: ${track.album.name}\nSpotify Link: ${track.external_urls.spotify}`);
        }).catch(function (err) {
            console.log("Oh no, something went wrong with that too!");
        });
    });
}

function getMovie() {
    inquirer.prompt([
        {
            type: "input",
            message: "What movie?",
            name: "movieTitle"
        }
    ]).then(function (res) {
        axios.get(`http://www.omdbapi.com/?apikey=${keys.omdb.id}&t=${res.movieTitle}`).then(function (response) {
            var movie = response.data;
            console.log(`Title: ${movie.Title}\nYear: ${movie.Year}\nIMDB Rating: ${movie.Ratings[0].Value}\nRotten Tomatoes Rating: ${movie.Ratings[1].Value}\nCountry: ${movie.Country}\nLanguage(s): ${movie.Language}\nPlot: ${movie.Plot}\nActors: ${movie.Actors}`);
            logData(`Title: ${movie.Title}\nYear: ${movie.Year}\nIMDB Rating: ${movie.Ratings[0].Value}\nRotten Tomatoes Rating: ${movie.Ratings[1].Value}\nCountry: ${movie.Country}\nLanguage(s): ${movie.Language}\nPlot: ${movie.Plot}\nActors: ${movie.Actors}`);
        }).catch(function (err) {
            console.log("Sorry, I can't find that movie... Here's Mr. Nobody instead.");
            axios.get(`http://www.omdbapi.com/?apikey=${keys.omdb.id}&t=Mr.Nobody`).then(function (response) {
                var mrNobody = response.data;
                console.log(`Title: ${mrNobody.Title}\nYear: ${mrNobody.Year}\nIMDB Rating: ${mrNobody.Ratings[0].Value}\nRotten Tomatoes Rating: ${mrNobody.Ratings[1].Value}\nCountry: ${mrNobody.Country}\nLanguage(s): ${mrNobody.Language}\nPlot: ${mrNobody.Plot}\nActors: ${mrNobody.Actors}`);
                logData(`Title: ${mrNobody.Title}\nYear: ${mrNobody.Year}\nIMDB Rating: ${mrNobody.Ratings[0].Value}\nRotten Tomatoes Rating: ${mrNobody.Ratings[1].Value}\nCountry: ${mrNobody.Country}\nLanguage(s): ${mrNobody.Language}\nPlot: ${mrNobody.Plot}\nActors: ${mrNobody.Actors}`);
            }).catch(function (err) {
                console.log("Oh no, something went wrong with that too!");
            })
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function getRandom() {
    fs.readFile("./random.txt", "utf8", function (err, data) {
        spotify.search({
            type: "track",
            query: data
        }).then(function (response) {
            var track = response.tracks.items[0];
            console.log(`Artist(s): ${track.artists[0].name}\nSong Title: ${track.name}\nAlbum Title: ${track.album.name}\nSpotify Link: ${track.external_urls.spotify}`);
            logData(`Artist(s): ${track.artists[0].name}\nSong Title: ${track.name}\nAlbum Title: ${track.album.name}\nSpotify Link: ${track.external_urls.spotify}`);
        }).catch(function (err) {
            console.log(err);
        });
    })
}

function logData(str) {
    fs.appendFile("./log.txt", `${str}\n\n`, function (err) {
        if (err) {
            console.log(err);
        }
    });
}