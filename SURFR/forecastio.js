var async = require("async");
var request = require("request");
var fahrenheitToCelsius = require('fahrenheit-to-celsius');
var evaluateBeach = require("./evaluateBeach.js");

var completedBeaches = [];
var FORECASTIO_API_KEY = "7ff8dbcd83aed43898a7a32dc254b98e";

module.exports = {
	/**
		* Calls the getWeather function for each element of the
		* geocodedData array.
		* @param {Array} geocodedData: key,value map containing
		* beaches and their corresponding data
		* @param {callback} callback: Executes once the asynchonous task is
		* completed to ensure data has been defined.
	*/
    getWeather: function(geocodedData, callback) {
    	completedBeaches = [];

        async.each(geocodedData, getWeather, function (err, response){
        	console.log("Completed getting weather!");
            callback(completedBeaches);
        });
    }
}

/**
	* Requests weather data from the Forecast.io API
	* @param {Array} geocodedData: Array of beach information 
	* @param {callback} callback: executed when beach data is
	* added to the completedBeaches array
*/
function getWeather(geocodedData, callback) {

	/* Get the coordinates from the geocoded data */
	var latitude = geocodedData.latitude;
	var longitude = geocodedData.longitude;

	/* Build the Forecase.io request URL */
	var forecastioUrl = "";
	forecastioUrl = "https://api.forecast.io/forecast/";
	forecastioUrl += FORECASTIO_API_KEY;
	forecastioUrl += "/" + latitude + "," + longitude;

	/* Set request options */
	const options = {
		url :  forecastioUrl,
		json : true
	 };

	/* 
		* Send request to forecast.io and push JSON data onto the
		* existing array for each beach.
	 */
	request(options, function(err, response, weatherData) {
		var weatherSummary = weatherData.currently.summary;
		var temperature = parseInt(fahrenheitToCelsius(weatherData.currently.temperature));
		var weatherIcon = weatherData.currently.icon;
		var rating = evaluateBeach.rateBeach(geocodedData);
		var surfboardType = evaluateBeach.recommendSurfBoard(geocodedData);
		/* Convert decimal value to percentage */
		var chanceOfRain = weatherData.currently.precipProbability * 100;
		chanceOfRain += "%";

		geocodedData.weatherSummary = weatherSummary;
		geocodedData.temperature = temperature;
		geocodedData.weatherIcon = weatherIcon;
		geocodedData.rating = rating;
		geocodedData.surfboardType = surfboardType;
		geocodedData.chanceOfRain = chanceOfRain;
		completedBeaches.push(geocodedData);
		callback();
	});
}