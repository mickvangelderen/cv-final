var app = require('./server/app');

var server = app.listen(3000, function() {
	console.log('Server listening on', server.address());
});