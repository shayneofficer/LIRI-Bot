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
        message: "Please choose a command",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "commandChoice"
    }
]).then(function (ans) {
    // Switch Statement Version: 
    switch (ans.commandChoice) {
        case "concert-this":
            getConcerts();
            break;
        case "spotify-this-song":
            getSong();
            break;
        case "movie-this":

            break;
        case "do-what-it-says":

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
            for (var i = 0; i < response.data.length; i++) {
                var concertDate = moment(response.data[i].datetime).format("MM/DD/YYYY");

                console.log(`${response.data[i].venue.name} || ${response.data[i].venue.city} || ${concertDate}`);
            }
        });
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
        }).catch(function (err) {
            console.log(`Sorry, I couldn't find that song... Here's "The Sign" by Ace of Base instead.`);
            console.log(`Artist: Ace of Base\nSong Title: The Sign\nAlbum Title: The Sign (US Album) [Remastered]\nSpotify Link: https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE`);
        })
    }).catch(function (err) {
        console.log(`You didn't enter a song title... Here's "The Sign" by Ace of Base.`);
        console.log(`Artist: Ace of Base\nSong Title: The Sign\nAlbum Title: The Sign (US Album) [Remastered]\nSpotify Link: https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE`);
    });
}