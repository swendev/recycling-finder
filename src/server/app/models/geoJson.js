// setup
var mongoose     = require("mongoose");
var Schema       = mongoose.Schema;

// schema for mongoose to interact with mongodb
var GeoLocationSchema   = new Schema({
	name: String,
	type: String,
	loc: {
		type: {
			type: String,
			required: true,
			enum: ["Point", "LineString", "Polygon"],
			default: "Point"
		},
		coordinates: [Number]
	}
});
// ensure the geo location uses 2dsphere
GeoLocationSchema.index({ loc : "2dsphere" });

module.exports = mongoose.model('GeoLocation', GeoLocationSchema);