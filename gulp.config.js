module.exports = function() {
	var server = './src/';

	var config = {

		/// File Paths
		temp: './.tmp/',
		alljs:[
		'./src/**/*.js',
		'./*.js'
		],
		allts: './src/client/app/**/*.ts',
		testjs: './test/',
		server: server,

		//NODE SETTINGS
		defaultPort: 8000,
		nodeServer: './dist/server/app.js'
	};

	return config;
};