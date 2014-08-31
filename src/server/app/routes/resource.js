// setup
var express         = require("express");
var router          = express.Router();
var GeoLocation     = require("../models/geoJson");
var config          = require("../config");
// db setup
var mongoose        = require("mongoose");
mongoose.connect("mongodb://" + config.db.url + ":" + config.db.port + "/" + config.db.name + ""); // connect to our database

// routes for our api
// =============================================================================

// middleware to use for all requests
router.use(function(req, res, next) {
	console.log("middleware call (do stuff like auth)");
	next(); // forward to the matching route
});

// routes that end in /locations
// ----------------------------------------------------
router.route("/locations")

	// create a location
	.post(function(req, res) {

		var location                = new GeoLocation(); 		// create a new instance of the GeoLocation model
		location.name               = req.body.name;            // set the locations name (comes from the request)
		location.type               = req.body.type;
		location.loc.type           = req.body.geometry;            // set the type of the geo location (sphere, point, polygon)
		location.loc.coordinates    = [req.body.lng, req.body.lat];

		// save the location and check for errors
		location.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: "location added" });
		});

	})
	// get all locations
	.get(function(req, res) {
		GeoLocation.find(function(err, locations) {
			if (err)
				res.send(err);

			res.json(locations);
		});
	});


// routes that end in /locations/:location_id
// ----------------------------------------------------
router.route("/locations/:location_id")

	// get the location with the matching location_id
	.get(function(req, res) {
		GeoLocation.findById(req.params.location_id, function(err, location) {
			if (err)
				res.send(err);
			res.json(location);
		});
	})
	// update the location with the matching location_id
	.put(function(req, res) {

		// use our location model to find the location we want
		GeoLocation.findById(req.params.location_id, function(err, location) {

			if (err)
				res.send(err);

			// update the location data
			location.name               = req.body.name;
			location.loc.type           = req.body.type;
			location.loc.coordinates    = [req.body.lng, req.body.lat];

			// save the location
			location.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: "location updated" });
			});

		});
	})
	// delete the location with the matching location_id
	.delete(function(req, res) {
		GeoLocation.remove({
			_id: req.params.location_id
		}, function(err, location) {
			if (err)
				res.send(err);

			res.json({ message: "location deleted" });
		});
	});

//
// ----------------------------------------------------
	router.route("/locations/near/:lng/:lat/:type/:max")

		// get locations near the get params
		.get(function(req, res) {
			// setup geoJson for query
			var geoJson             = {};
			geoJson.type            = "Point";
			geoJson.coordinates     = [parseFloat(req.params.lng), parseFloat(req.params.lat)];

			// setup options for query
			var options             = {};
			options.spherical       = true;
			options.maxDistance     = parseInt(req.params.max)/6371000;

			// query db with mongoose geoNear wrapper
			GeoLocation.geoNear(geoJson, options, function (err, results, stats) {
				// error handling
				if (err) { res.send(err); }

				// success handling
				var locations = [];
				//flatten and filter results

				if(results.length !== undefined) {
					for(var i = 0; i < results.length; i++) {
						if(req.params.type == "all" || results[i].obj.type == req.params.type) {
							locations[i] = {
								name: results[i].obj.name,
								type: results[i].obj.type,
								dis: Math.round(results[i].dis*6371000),
								loc: results[i].obj.loc
							};
						}
					}
				}

				res.json(locations);
			});
		});


module.exports = router;