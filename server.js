const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const errorHandler = require('errorhandler')
const compression = require('compression')
const favicon = require('serve-favicon')
const serveStatic = require('serve-static')

const renderRouter = require('./app/renderRouter')
const apiRouter = require('./app/apiRouter')
const app = express()
const port = process.env.PORT || 1337

app.use(compression())
app.use(express.json())
app.use(express.urlencoded())

app.use('/api', apiRouter)
app.use('/', renderRouter)
app.use(serveStatic(__dirname + '/public', { maxAge: '1d' }))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

if ('development' === app.get('env')) app.use(errorHandler())

app.set('views', __dirname + '/views')
app.engine('hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs'
}))
app.set('view engine', 'hbs')

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }, err => {
	if (err) throw err
	if (app.get('env') === 'development') {
		const d = new Date()
		console.log(`[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] mLab connected`)
	}
})

app.listen(port, () => {
	if (app.get('env') === 'development')
		console.log(`App listening on http://localhost:${port}/`)
})
