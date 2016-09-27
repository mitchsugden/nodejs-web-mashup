/* npm modules */
var fs = require("fs");
var express = require('express');
var request = require("request");
var async = require("async");
/* Local modules */
var swellcast = require("./swellcast.js");
var googleMaps = require("./google-maps.js");

var body = "";
var currentReport = null;
var app = express();

/* Specifies the location of our static files (HTML, CSS, JAVASCRIPT) */
app.use(express.static('public'));

/* Handle requests */
app.get('/', function(appReq, appRes) {

    console.log("Client request recieved...");

    /* Enter if this has not been executed yet, or if it is time for a new report */
    if (currentReport == null || currentReport != swellcast.getLatestReport()) {
    	console.log("Updating beach data..."); 
    	/*
	    	* Store static files in preparation for creating the body HTML
	    	* to send to the client
    	*/
	    openTags = fs.readFileSync("public/openTags.html", "utf8");
	    closeTags = fs.readFileSync("public/closeTags.html", "utf8");
	    googleMapsJS = fs.readFileSync("public/map.js", "utf8");

	    swellcast.getSurfData(function(swellcastRes){
	        console.log("Completed getting all data!");
	        console.log("Creating markers...");
	        var markersString = googleMaps.createMarkers(swellcastRes);

	        body = "";
	        body += openTags;
	        body += googleMapsJS;
	        body += markersString;
	        body += closeTags;

	        appRes.send(body);
	        appRes.end(); 
	        currentReport = swellcast.getLatestReport();
	        console.log("Done!");
	    });
    }
    /* Return the current report from memory */
    else {
	    appRes.write(body);
	    appRes.end();
	    console.log("Returned cached report");
    }
});

/* Redirect all unknown URLs to the root */ 
app.all('*', function(req, res) {
  res.redirect('/');
});
       
app.listen(80, function () {
  console.log('Listening on port 80...');
});