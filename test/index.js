/* global describe, it, before */
'use strict';

process.env.NODE_ENV = 'testing';
require('../app');
const fs = require('fs');
const config = require('config');
const request = require('request-promise').defaults({
	resolveWithFullResponse: true,
	simple: false
});
const Document = require('../db/document');

const getURL = (path) => `http://localhost:${config.port}${path}`;

describe('xml REST API', async function() {
	let uploadedFileId;
	let uploadedFileBody;

	before(async function() {
		await Document.remove({});
	});

	it('upload normal xml file', async function() {
		const fileName = 'sample.xml';
		const response = await request({
			method: 'post',
			uri: getURL('/xml'),
			formData: {
				name: fileName,
				file: fs.createReadStream(`${config.root}/test/assets/${fileName}`)
			},
		});
		const body = JSON.parse(response.body);

		response.statusCode.should.eql(200);
		body.name.should.eql(fileName);
		uploadedFileId = body.id;
	});

	it('upload invalid xml file', async function() {
		const fileName = 'wrong.xml';
		const response = await request({
			method: 'post',
			uri: getURL('/xml'),
			formData: {
				name: fileName,
				file: fs.createReadStream(`${config.root}/test/assets/${fileName}`)
			},
		});
		const body = JSON.parse(response.body);

		response.statusCode.should.eql(400);
		body.message.should.eql('invalid xml');
	});

	it('get existed xml file', async function() {
		const response = await request({
			method: 'get',
			uri: getURL(`/xml/${uploadedFileId}`)
		});

		response.statusCode.should.eql(200);
		uploadedFileBody = JSON.parse(response.body).xml;
	});

	it('get inexistent xml file', async function() {
		const response = await request({
			method: 'get',
			uri: getURL('/xml/5bb76583415b4f49782dd367')
		});

		response.statusCode.should.eql(404);
	});

	it('patch xml file', async function() {
		const response = await request({
			method: 'patch',
			uri: getURL(`/xml/${uploadedFileId}`),
			json: true,
			body: [
				{
					id: uploadedFileBody.elements[0].elements[0].id,
					text: 'test',
					attributes: {
						attt: 'test2'
					}
				}
			]
		});

		response.statusCode.should.eql(200);
		response.body.status.should.eql('ok');
	});
})