module.exports = {
	development: {
		provider: 'redis',
		options: {
			'redis': {
				port: process.env.MONITOR_REDIS_PORT_DEV || 6379,
				host: process.env.MONITOR_REDIS_ADDR_DEV || '127.0.0.1',
				db: process.env.MONITOR_REDIS_DB_DEV || 3
			}
		}
	}
};