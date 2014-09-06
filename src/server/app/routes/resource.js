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
		// check if a location already exists
		var geoJson = {
			"type": "Point",
			"coordinates" : [parseFloat(req.body.lng), parseFloat(req.body.lat)]
		};

		// setup options for query
		var options = {
			"near": geoJson,
			"distanceField": "distance",
			"maxDistance": 100,
			"spherical": true
		};

		// determine if an array has any elements not in another array
		function getNewTypes(oldTypes, newTypes) {
			var tempTypes = [];
			for( var i = 0; i < newTypes.length; i++) {
				if(oldTypes.indexOf(newTypes[i]) == -1) {
					tempTypes.push(newTypes[i]);
				}
			}
			return tempTypes;
		}

		var types = req.body.types.split(",");

		console.log(types);

		// query db with mongoose
		GeoLocation.aggregate(
			[
				{ "$geoNear": options },
				{ "$sort": { "distance": -1 } } // Sort nearest first
			],
			function(err, docs) {
				if(err) {
					res.send(err);
				} else {
					if(docs.length > 0) {
						var tempTypes = getNewTypes(docs[0].type, types);
						if (tempTypes.length < 1) {
							//In the array!
							res.json({ message: "location exists already" });
						} else {
							// use our location model to find the location we want
							GeoLocation.findById(docs[0]._id, function(err, location) {
								if (err) { res.send(err); }
								else {
									//console.log(location);
									location.type.push(tempTypes);
									location.save(function(err) {
										if (err) { res.send(err); }
										else { res.json({ message: "location altered" }); }
									});
								}
							});
						}
					} else {
						var location = new GeoLocation();
						location.name               = req.body.name;        // set the locations name (comes from the request)
						location.type               = types;
						location.loc.type           = req.body.geometry;    // set the type of the geo location (sphere, point, polygon)
						location.loc.coordinates    = [req.body.lng, req.body.lat];
						location.save(function(err) {
							if (err) { res.send(err); }
							else { res.json({ message: "location added" }); }
						});
					}
				}
			}
		);
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
			var geoJson = {
				"type": "Point",
				"coordinates" : [parseFloat(req.params.lng), parseFloat(req.params.lat)]
			};

			// setup options for query
			var options = {
				"near": geoJson,
				"distanceField": "distance",
				"maxDistance": parseInt(req.params.max),
				"spherical": true
			};

			if(req.params.type !== "all") {
				options.query = { "type": req.params.type};
			}

			// query db with mongoose
			GeoLocation.aggregate(
				[
					{ "$geoNear": options },
					{ "$sort": { "distance": 1 } } // Sort nearest first
				],
				function(err,docs) {
					if(err) { res.send(err); }
					else {
						res.json(docs);
					}
				}
			);
		});

module.exports = router;