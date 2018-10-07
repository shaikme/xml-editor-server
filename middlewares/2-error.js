'use strict';

exports.init = (app) =>
	app.use(async (ctx, next) => {
		try {
			await next();
		} catch (e) {
			ctx.status = e.status || 500;
			ctx.body = {
				status: ctx.status,
				message: e.message
			};
		}
	});
