module.exports = function() {
	var server = './src/';


	var config = {
		temp: './.tmp/',
		//file paths
		alljs:[
		'./src/**/*.js',
		'./*.js'
		],
		server: server,

		//NODE SETTINGS
		defaultPort: 8000,
		nodeServer: './src/app.js'
	};

	return config;
};