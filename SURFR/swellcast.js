var async = require("async");
var request = require("request");
var googleMaps = require("./google-maps.js");

const NUM_LOCATIONS = 50;
const SWELLCAST_API_KEY = "ziBc7iKQmp5Ry6KpC3sU";
var swellcastData = [];
var swellcastUrls = [];

/*-------------------------------------------------------------------------------------------|    
|--------------------Public functions to be exposed to our server----------------------------| 
*/
module.exports = {

    /*
        * Runs requests on swllcastUrls asynchonously to get data from the Swellcast API. 
        * When the response is recieved it is passed to our Google Maps API.
    */
    getSurfData: function(callback) {
        getBeachUrls();
        swellcastData = [];

        console.log("Getting swellcast data...");
        async.each(swellcastUrls, getBeachInfo, function (err, response){
            console.log("Completed getting swellcast data!");
            console.log("Geocoding data....");
            googleMaps.getLocations(swellcastData, function(response){
                callback(response);
            });
      });       
    },
    // Getter to get the latest report index
    getLatestReport: function() {    return getLatestReport();   }
}

/*-------------------------------------------------------------------------------------------|
|---------------------------------Private functions------------------------------------------| 
*/

/*
    * Creates a string for each beach to be used in a GET request
    * and adds it to a global array
*/
function getBeachUrls() {
    // Empty the array to avoid duplicates on each call
    swellcastUrls = [];

    for (var i = 0; i <= NUM_LOCATIONS; i++) {
        swellcastUrls.push("http://swellcast.com.au/api/v1/locations/" + i + ".json?api_key=" + SWELLCAST_API_KEY);
    }
}

/*
    * Takes JSON and saves meaningful information into a [key][value] map.
    * input: JSON data from Swellcast.  
    * output: An array containing only the information we need from the JSON
*/
function parseSurfData(swellcastJSON) {
    var reportIndex = getLatestReport();
    var newBeach = [];
    var name = swellcastJSON.name;
    var swellHeight = swellcastJSON.three_hourly_forecasts[reportIndex].swell_height_metres;
    var swellDirection = swellcastJSON.three_hourly_forecasts[reportIndex].swell_direction_compass_point;
    var windSpeed = swellcastJSON.three_hourly_forecasts[reportIndex].wind_speed_knots;
    var windDirection = swellcastJSON.three_hourly_forecasts[reportIndex].wind_direction_compass_point;

    newBeach.name = name;
    newBeach.swellHeight = swellHeight;
    newBeach.swellDirection = swellDirection;
    newBeach.windSpeed = windSpeed;
    newBeach.windDirection = windDirection;

    return newBeach;
}

/*
    * Sends a request to the swellcast API and parses the 
    * JSON response. The response is then added to the global
    * swellcastData array. 
*/
function getBeachInfo(url, callback) {

    const options = {
      url :  url,
      json : true
    };

  request(options, function(err, response, swellcastJSON) {
    if (swellcastJSON.name != null) {
        /* 
            * Pushes a new map object onto swellcastData
            * This gives swellcastData the structure: [index][map]
        */
        swellcastData.push(parseSurfData(swellcastJSON));
        }
      callback(err);
    });
  }

/*
    * Gets the current time and returns the corresponding
    * report index. Reports are in 3 hour intervals so there 
    * are 8 indexes. 
*/
function getLatestReport() {
    var date = new Date();
    var currentHour = date.getHours();

    if (currentHour <= 2) {
        return 0;
    } else if (currentHour <= 5) {
        return 1;
    } else if (currentHour <= 8) {
        return 2;
    } else if (currentHour <= 11) {
        return 3;
    } else if (currentHour <= 14) {
        return 4;
    } else if (currentHour <= 17) {
        return 5;
    } else if (currentHour <= 20) {
        return 6;
    } else if (currentHour <= 23) {
        return 7;
    }

    /* We could not find the current time */
    return -1;
}