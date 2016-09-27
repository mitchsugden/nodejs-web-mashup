var map;
var geocoder;
var currentInfoWindow = null; 

/*
  * Creates a Google Maps marker
*/
function createMarker(name, swellHeight, swellDirection, windSpeed, windDirection, latitude, longitude, weatherSummary, weatherIcon, temperature,  rating, recommendedBoard, chanceOfRain) {

  /* 
    * Set up the marker image.
    * Taken from Google Maps API documentation.
  */
  beachImageUrl = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

  var image = {
    url: beachImageUrl,
    size: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  };

  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };

  /* Create HTML string for the infowindow */
  var markerInfo = createInfoWindowText(name, swellHeight, swellDirection, windSpeed, windDirection, weatherSummary, temperature, weatherIcon, rating, recommendedBoard, chanceOfRain);

  var infowindow = new google.maps.InfoWindow({ 
    content: markerInfo 
  });  

  /* Create the marker */
  var latLng = new google.maps.LatLng(latitude,longitude);
  var marker = new google.maps.Marker({
    map: map,
    position: latLng,
    icon: image,
    shape: shape
  });

  /* Add event listener for infowindow */
  google.maps.event.addListener(marker, 'click', function() { 
    if (currentInfoWindow != null) { 
      currentInfoWindow.close(); 
    } 
    infowindow.open(map, marker); 
    currentInfoWindow = infowindow; 
  });
}

/*
  * Builds the HTML string to be used in the marker infowindow
*/
function createInfoWindowText(name, swellHeight, swellDirection, windSpeed, windDirection, weatherSummary, temperature, weatherIcon, rating, recommendedBoard, chanceOfRain) {

var infoHTML = '';
infoHTML += '<h1>' + name + '</h1>'+
'<h2><img id="icon" src="./images/icons/' + weatherIcon + '.png" />' + weatherSummary + ' ' + temperature + '<img id="icon" src="./images/icons/celsius.png" /></h2>' +
'<b>Chance of rain: ' + chanceOfRain + '</b><br>' +
'<b>Swell Height: ' + swellHeight + 'm</b> ' + swellDirection + '<br>' +
'<b>Wind Speed: ' + windSpeed + 'km/h</b> ' + windDirection + '<br>';

for(var i = 0; i < rating; i++) {
infoHTML += '<img id="star" src="./images/icons/star.png" />';
}

infoHTML += '<br><b>Recommended Board: ' + recommendedBoard + '</b>';

return infoHTML;
}

/*
  * Initialize the map. The closing bracket has been removed intentionally
  * as it is closed in the SURFR\closeTags.html file.
*/
function initMap() {
geocoder = new google.maps.Geocoder();
map = new google.maps.Map(document.getElementById('map'), {
center: {lat: -25.363, lng: 131.044},
zoom: 5
});

/* Create marker functions are added below dynamically by the server */