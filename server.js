// load environment varibles
//require("dotenv").config();

// grab our dependencies
const express = require("express"),
	app = express(),
	path = require("path"),
	port = process.env.PORT || 1337,
	exphbs = require("express-handlebars"),
	mongoose = require("mongoose"),
	cookieParser = require("cookie-parser"),
	flash = require("connect-flash"),
	bodyParser = require("body-parser"),
	expressValidator = require("express-validator"),
	errorHandler = require("errorhandler");

// cofigure our application
app.set("views", __dirname + "/views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

app.use(cookieParser());
app.use(flash());

app.use(require("./app/routes"));
app.use(express.static(__dirname + "/public"));

if ("development" === app.get("env"))
	app.use(errorHandler());

app.engine("hbs", exphbs({
	defaultLayout: "main",
	extname: ".hbs"
}));
app.set("view engine", "hbs");

mongoose.connect(process.env.DB_URI, (err) => {
	if (err) throw err;
	const d = new Date();
	console.log(`[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] mLab connected`);
});

app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}/`);
});