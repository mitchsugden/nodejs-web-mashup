var async = require("async");
var request = require("request");
var forecastio = require("./forecastio.js");

const GOOGLE_API_KEY = YOUR_API_KEY;
var geocodedBeachs = [];

/*-------------------------------------------------------------------------------------------|    
|--------------------Public functions to be exposed to our server----------------------------| 
*/
module.exports = {

    /*
        * Runs Google Maps geocode server on data from swellcast asynchonously to get the 
        * latitude and longitude. 
        * When the response is recieved it is passed to our forecast.io API to get the 
        * weather based on the location data.
    */
    getLocations: function(swellcastData, callback) {
        geocodedBeachs = [];


        async.each(swellcastData, geocode, function(){
            console.log("Completed geocoding data!");
            console.log("Getting weather....");
            forecastio.getWeather(geocodedBeachs, function(response){
                callback(response);
            });
      });      
    },

    /*
        * Creates a string that calls the 'createMarker' function
        * from our maps.js static file for each beach.
        * Returns: A string of function calls that are executed on the clients browser.
    */
    createMarkers: function(beachData) {
    	var allMarkers = "";

    	for(var i = 0; i < beachData.length; i++) {
	    	allMarkers += 'createMarker("' + 
            beachData[i].name + '", "' + 
            beachData[i].swellHeight + '", "' + 
            beachData[i].swellDirection + '", "' + 
            beachData[i].windSpeed + '", "' + 
            beachData[i].windDirection + '", "' + 
            beachData[i].latitude + '", "' + 
            beachData[i].longitude + '", "' +
            beachData[i].weatherSummary + '", "' +
            beachData[i].weatherIcon + '", "' +
            beachData[i].temperature + '", "' +
            beachData[i].rating + '", "' +
            beachData[i].surfboardType + '", "' +
            beachData[i].chanceOfRain + 
            '");';
    	}

    	return allMarkers;
    }
}

/*-------------------------------------------------------------------------------------------|
|---------------------------------Private functions------------------------------------------| 
*/

/*
    * Sends a geocode request using the beach name.
    * Adds the latitude and longitude to the swellcast data map and
    * pushes it onto the geocodedBeachs global array.
*/
function geocode(swellcastData, callback) {

    /* Add 'Australia' to the search term in case areas of the same name exist overseas */
	var searchTerm = swellcastData.name + " Australia";

	  var geocodeUrl = "";

	  geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=";
	  geocodeUrl += searchTerm;
	  geocodeUrl += "&key=";
	  geocodeUrl += GOOGLE_API_KEY;

      const options = {
      url :  geocodeUrl,
      json : true
  	  };

	  request(options, function(err, response, geocodeData) {
	          swellcastData.latitude = geocodeData.results[0].geometry.location.lat;
	          swellcastData.longitude = geocodeData.results[0].geometry.location.lng;

	          geocodedBeachs.push(swellcastData);
	          callback();
	    });
}
