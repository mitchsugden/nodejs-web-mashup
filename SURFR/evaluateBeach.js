module.exports = {
	/*
	Summary of the beach rating:
	5 stars: If it's not windy, the sun is out and the swell is big enough
	4 stars: If it's not windy and the swell is big enough (surf is still good but might be cloudy/raining)
	3 stars: If it's not raining or too windy and the swell is big enough
	2 stars: If it's windy but the swell is big enough
	1 star: If there's no swell
	*/
	rateBeach: function(beachData) {
		/* Default rating of 1 star */
		var rating = 1;

		if(beachData.windSpeed <= 15) {
			if(beachData.weatherIcon == "clear-day" && beachData.swellHeight >= 2) {
				return 5;
			}
			if(beachData.swellHeight >= 2) {
				return 4;
			}
		}

		if(beachData.weatherIcon == "clear-day" || beachData.weatherIcon == "cloudy" || beachData.weatherIcon == "partly-cloudy-day" || 
			beachData.weatherIcon == "clear-night" || beachData.icon == "partly-cloudy-night") {
			if(beachData.windSpeed <= 25 && beachData.swellHeight >= 2) {
				return 3;
			}
		}

		if(beachData.swellHeight >= 2) {
			return 2;
		}

		return rating;
	},
	/*
	Summary of surfboard recommendation:
	Longboard: for small swell
	Big wave gun: for large swell
	Shortboard: for medium swell and low wind
	Super fish: for medium swell and high wind
	*/
	recommendSurfBoard: function(beachData) {
		/* Default board type. Good all-rounder */
		var surfBoardType = "Super fish";

		if (beachData.swellHeight <= 2) {
			return "Longboard";
		} 
		else if (beachData.swellHeight >= 10) {
			return "Big wave gun";
		}

		if(beachData.windSpeed <= 15) {
			return "Shortboard";
		}

		return surfBoardType;
	}
}