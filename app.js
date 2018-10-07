'use strict';

const path = require('path');
const fs = require('fs');

const config = require('config');
const Koa = require('koa');
const Router = require('koa-router');
const db = require('./db');


const app = new Koa();
const router = new Router();

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
const routes = fs.readdirSync(path.join(__dirname, 'routes'));

middlewares.forEach((middleware) => require(`./middlewares/${middleware}`).init(app));
routes.forEach((route) => require(`./routes/${route}`).init(router));

app.use(router.routes());

db.connection.once('open', () => {
	app.listen(process.env.PORT || config.port || 8000);
});

