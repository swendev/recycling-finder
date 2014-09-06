// setup
var express    = require("express"); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require("body-parser");
var routes = require("./app/routes/resource");  // define routes

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	next();
});
// register routes
// all of our routes will be prefixed with /api
app.use('/api', routes);

// start the server
app.listen(port);
console.log("express server is listening on port: " + port);