'use strict';

var express = require('express'),
	bodyParser = require('body-parser'),
	compress = require('compression'),
	storeFactory = require('./../../lib/store/store-factory'),
	servicesApi = require('./api/services'),
	path = require('path'),
	reportsApi = require('./api/reports'),
	jiraApi = require('./api/jira'),
	sensorApi = require('./api/sensor'),
	http = require('http'),
	nodemailer = require('nodemailer');

var store = storeFactory.getStorageInstance('development');
if (!store) {
	console.error('Error creating storage for env');
}
var app = express(store);
var port = process.env.PORT || 3000;
var httpsPort = process.env.HTTPSPORT || 4400;

app.use('/app', express.static(path.resolve(__dirname, '../', 'client/app')));
app.use('/assets', express.static(path.resolve(__dirname, '../', 'client/assets')));
app.use('/node_modules', express.static(path.resolve(__dirname, '../../', 'node_modules')));
app.use('/bower_components', express.static(path.resolve(__dirname, '../../', 'bower_components')));
function serveIndex(req, res) {
	res.sendFile(path.resolve(__dirname, '../client/index.html'));
}

//nodemailer testing
var smtpConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'technical.ta@gmail.com',
		pass: 'BaseG0d!'
	}
};

var transporter = nodemailer.createTransport(smtpConfig);

var mailOptions = {
	from: '"Kiet Ta" <technical.ta@gmail.com>', //sender
	to: 'kta@deloitte.com', //recepients 
	subject: 'Hello',
	text: 'Hello world',
	html: '<b>Hello world</b>'
};

app.use('/sendmail', function() {
	transporter.sendMail(mailOptions, function(error, infor) {
		if(error) {
			return console.log(error);
		} 
		console.log('Message sent: ' + info.response);
	});
});



app.use(compress());
app.use('/api/sensor', sensorApi.getRoutes());
app.use('/api/jira', jiraApi.getRoutes());
app.use('/api/report', reportsApi.getRoutes(store));
app.use('/api', servicesApi.getRoutes(store));
app.get('/*', serveIndex);

var properties = require('./envProperties');
console.log('the properties file says useSSL is ' + properties.USESSL);
if(properties.USESSL == 'false')
{
app.listen(port, function() {
	console.log('Gulp is running this app on: ' + port);
});
}
else if (properties.USESSL == 'true')
{
var https = require('https'),      // module for https
    fs =    require('fs');         // required to read certs and keys
	var options = {
    key:    fs.readFileSync(properties.SSL_KEY),
    cert:   fs.readFileSync(properties.SSL_CERT),
    ca:     fs.readFileSync(properties.SSL_BUNDLE),
    requestCert:        false,
    rejectUnauthorized: false,
};
https.createServer(options, app).listen(httpsPort);
console.log('HTTPS Express server listening on port ' + httpsPort); 


var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    //res.writeHead(301, { "Location": "https://localhost:4400" });
    res.end();
}).listen(port);

}

module.exports = app;

