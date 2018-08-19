const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const errorHandler = require('errorhandler')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const app = express()
const port = process.env.PORT || 1337
const renderRouter = require('./app/renderRouter')
const apiRouter = require('./app/apiRouter')

app.set('views', __dirname + '/views')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/', renderRouter)
app.use('/api', apiRouter)
app.use(express.static(__dirname + '/public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

if ('development' === app.get('env')) app.use(errorHandler())

app.engine('hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs'
}))
app.set('view engine', 'hbs')

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, err => {
	if (err) throw err
	const d = new Date()
	console.log(`[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] mLab connected`)
})

app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}/`)
})
