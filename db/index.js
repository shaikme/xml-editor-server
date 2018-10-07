'use strict';

const mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = Promise;

mongoose
	.connect(
		process.env.MONGODB_URI || config.get('dbUri'),
		{
			server: {
				socketOptions: {
					keepAlive: 1
				},
				poolSize: 5
			}
		}
	)
	.catch((err) => {
		console.error(`Mongo connection error: ${err.message}`);
		process.exit(1);
	});

module.exports = mongoose;
