var express = require('express');
var lessMiddleware = require('less-middleware');

var app = module.exports = express();

app.set('views', 'client');
app.set('view engine', 'jade');
app.locals['doctype'] = 'html';

// styles
app.use(lessMiddleware('client', {
	dest: 'client',
	force: true,
	compiler: { compress: false }
}));

// static content
app.use(express.static('bower_components'));
app.use(express.static('client'));

app.get('/', function(req, res, next) {
	res.render('index');
});

// Renderable pages
app.get(/^\/(([\w\d\-\._]+\/)*[\w\d\-\._]+)\.html$/, function(req, res, next) {
	res.render(req.params[0]);
});

// Renderable pages without .html
app.get(/^\/(([\w\d\-_]+\/)*[\w\d\-_]*)$/, function(req, res) {
	res.render(req.params[0]);
});

// handle failed to lookup view errors
app.use(function(error, req, res, next) {
	if (!error.view || !/Failed to lookup view/.test(error)) return next(error);

	return res.status(404).send(error);
});