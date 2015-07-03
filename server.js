var https = require('https');
var app = require('./server/app');
var fs = require('fs');

var server = module.exports = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('crt.pem')
}, app).listen(3000, function() {
	console.log('Server listening on', server.address());
});
