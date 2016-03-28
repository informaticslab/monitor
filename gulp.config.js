module.exports = function() {
	var server = './src/';


	var config = {

		/// File Paths
		temp: './.tmp/',
		alljs:[
		'./src/**/*.js',
		'./*.js'
		],
		testjs: './test/',
		server: server,

		//NODE SETTINGS
		defaultPort: 8000,
		nodeServer: './src/app.js'
	};

	return config;
};