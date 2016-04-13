var $ = require('gulp-load-plugins')({lazy: true});
var config = require('./gulp.config')(),
	tscConfig = require('./src/client/tsconfig'),
	port = process.env.PORT || config.defaultPort;

var gulp = require('gulp'),
	args = require('yargs').argv,
	del = require('del');


// clean contents of the dist folder
gulp.task('clean', function () {
	return del('dist/**/*');
});

// lint JS code
gulp.task('lint', function() {
	log('Analizing source with JSHint');

	return gulp
		.src(config.alljs)
		.pipe($.if(args.verbose, $.print()))
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
		.pipe($.jshint.reporter('fail'));
});

gulp.task('run-server-dev', ['lint'], function() {
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
		.on('restart', ['lint'], function(ev) {
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

// Typescript compile
gulp.task('compile', ['clean'], function() {
	return gulp
		.src(config.allts)
		.pipe($.sourcemaps.init())
		.pipe($.typescript(tscConfig.compilerOptions))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('dist/client/app'));
});

// copy cleint dependencies
gulp.task('copy:libs', ['clean'], function() {
	return gulp
		.src([
			'node_modules/angular2/bundles/angular2-polyfills.js',
			'node_modules/systemjs/dist/system.src.js',
			'node_modules/rxjs/bundles/Rx.js',
			'node_modules/angular2/bundles/angular2.dev.js',
			'node_modules/angular2/bundles/router.dev.js',
			'node_modules/es6-shim/es6-shim.min.js',
			'node_modules/systemjs/dist/system-polyfills.js',
		])
		.pipe(gulp.dest('dist/client/lib'));
});

//cop typings
gulp.task('copy:typings', ['clean'], function() {
	return gulp
		.src('typings/**/*')
		.pipe(gulp.dest('dist/typings'));
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
	return gulp
		.src(['src/client/app/**/*', 'src/client/index.html', '!src/client/app/**/*.ts', '!src/client/app/*.json'], { base: './src/client'})
		.pipe(gulp.dest('dist/client'));
});

// gulp.task('test', function() {
// 	$.env({var: {ENV:'Test'}});

// 	return gulp
// 		.src(config.testjs, {read: false})
// 		.pipe($.mocha({reporter: 'nyan'}));
// });

gulp.task('build-client', ['compile', 'copy:libs', 'copy:assets']);


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