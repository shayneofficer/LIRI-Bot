require("dotenv").config();

var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");

const keys = require("./keys");

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var title = process.argv[3];

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


// Switch Statement Version: 
switch (command) {
    case "concert-this":
        console.log("concert");
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