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
            console.log("concert");
            getConcerts();
            break;
        case "spotify-this-song":
            console.log("song");
            break;
        case "movie-this":
            console.log("movie");
            break;
        case "do-what-it-says":
            console.log("who knows?");
            break;

        default:
            console.log("bad input");
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