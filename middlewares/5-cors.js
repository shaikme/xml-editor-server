'use strict';

const cors = require('@koa/cors');

exports.init = (app) => {
	app.use(cors());
};
