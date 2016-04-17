var express = require('express'),
	app = express();

var http = require('http'),
	formidable = require('formidable'),
	fs = require('fs'),
	bodyParser = ('body-parser'),
	request = require('request');

	app.use(express.static(__dirname + '/'));

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/index.html');
	});

	app.post('/upload', function(req, res) {
		
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			var tempPath = files.file.path;

			fs.readFile(tempPath, 'utf8', function(err, data) {
				if (err) {
					res.status(500);
					res.json({'success': false});
				}else{
					var newCss = data.replace(/\n/g,"<br>");
					request({
						url: 'https://webtask.it.auth0.com/api/run/wt-joejansanchez-gmail_com-0/wt-css?webtask_no_cache=1',
						method: 'POST',
						form: {
							css: newCss
						}
					}, function (error, response, body) {
						res.status(200);
						app.set('view engine', 'ejs');
						res.render('convert', {css: body});
					});
				}
			});
		});
	});

	app.listen(3000, function(){
		console.log('Server express ready!');
	});
