'use strict';

const {
	getXmlById,
	getFilesName,
	getXmlFile,
	createXmlFile,
	editXmlFile,
	downloadXmlFile
} = require('../controllers/xml');

exports.init = (router) => {
	const path = '/xml';

	router
		.param('xmlId', getXmlById)
		.get(path, getFilesName)
		.get(`${path}/:xmlId`, getXmlFile)
		.get(`${path}/downoload/:xmlId`, downloadXmlFile)
		.post(path, createXmlFile)
		.patch(`${path}/:xmlId`, editXmlFile);
};