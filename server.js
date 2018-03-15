// grab our dependencies
const express = require('express'),
	path = require('path'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	exphbs = require('express-handlebars'),
	errorHandler = require('errorhandler'),
	cookieParser = require('cookie-parser'),
	favicon = require('serve-favicon'),
	app = express(),
	port = process.env.PORT || 1337;

// cofigure our application
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(require('./app/routes'));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if ('development' === app.get('env'))
	app.use(errorHandler());

app.engine('hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs'
}));
app.set('view engine', 'hbs');

mongoose.connect(process.env.DB_URI, (err) => {
	if (err) throw err;
	const d = new Date();
	console.log(`[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] mLab connected`);
});

app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}/`);
});