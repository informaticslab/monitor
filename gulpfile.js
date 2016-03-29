var $ = require('gulp-load-plugins')({lazy: true});
var config = require('./gulp.config')(),
	port = process.env.PORT || config.defaultPort;

var gulp = require('gulp'),
	args = require('yargs').argv,
	del = require('del');

gulp.task('vet', function() {
	log('Analizing source with JSHint');

	return gulp
		.src(config.alljs)
		.pipe($.if(args.verbose, $.print()))
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
		.pipe($.jshint.reporter('fail'));
});

gulp.task('run-dev', ['vet'], function() {
	log('Running server in development');
	var isDev = true;

	var nodeOptions = {
		script: config.nodeServer, //TODO app.js
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV' : isDev ? 'dev' : 'build'
		},
		watch: [config.server] //TODO define the files to restart on
	};

	return $.nodemon(nodeOptions)
		.on('restart', ['vet'], function(ev) {
			log('*** nodemon restarted');
			log('Files changed on restart: ' + ev);
		})
		.on('start', function() {
			log('*** nodemon started');
		})
		.on('crash', function() {
			log('*** nodemon crashed: script crashed for some reason');
		});
});

// gulp.task('test', function() {
// 	$.env({var: {ENV:'Test'}});

// 	return gulp
// 		.src(config.testjs, {read: false})
// 		.pipe($.mocha({reporter: 'nyan'}));
// });


///////////////
function log(msg) {
	if (typeof(msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.cyan(msg[item]));
			}
		}
	} else {
		$.util.log($.util.colors.cyan(msg));
	}
}