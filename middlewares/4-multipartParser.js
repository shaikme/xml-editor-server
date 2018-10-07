'use strict';

const parse = require('await-busboy');
const path = require('path');

exports.init = (app) =>
	app.use(async (ctx, next) => {
		if (ctx.request.is('multipart/*')) {
			const parser = parse(ctx, {
				autoFields: true,
				checkFile: (fieldname, file, filename) => {
					if (path.extname(filename) !== '.xml') {
						return false;
					}
					ctx.request.body.fileName = filename;
				}
			});
			let fileBuffers = [];
			let part;

			while ((part = await parser)) {
				fileBuffers.push(part.read());
			}

			ctx.request.body.file = Buffer.concat(fileBuffers).toString('utf-8');
			await next();
		} else {
			await next();
		}
	});
