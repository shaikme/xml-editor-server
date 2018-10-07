'use strict';

const { xml2js, js2xml } = require('xml-js');
const Document = require('../db/document');
const { traverse } = require('../utils/');
const db = require('../db');


module.exports = {
	async getXmlById(id, ctx, next) {
		if (!db.Types.ObjectId.isValid(id)) ctx.throw(400);

		const record = await Document.findById(id);

		if (!record) ctx.throw(404);

		ctx.state.id = id;
		ctx.state.name = record.name;
		ctx.state.document = record.document;

		await next();
	},

	async getFilesName(ctx) {
		ctx.body = await Document.find({}, { name: 1, id: 1 });
	},
	async getXmlFile(ctx) {
		ctx.body = { xml: ctx.state.document };
	},

	async createXmlFile(ctx) {
		const { file, fileName } = ctx.request.body;
		try {
			const json = xml2js(file, { trim: true, alwaysChildren: true });
			const newDoc = await new Document({
				name: fileName,
				document: json
			}).save();

			ctx.body = {
				id: newDoc.id,
				name: newDoc.name
			}
		} catch (e) {
			ctx.throw(400, 'invalid xml');
		}
	},

	async editXmlFile(ctx) {
		const { document, id } = ctx.state;

		ctx.request.body.forEach(node => {
			const nodeById = traverse(document, node.id);

			if (nodeById) {
				if (node.hasOwnProperty('text')) nodeById.text = node.text;

				if (node.attributes) {
					nodeById.attributes = {
						...nodeById.attributes,
						...node.attributes
					}
				}
			}
		})

		await Document.findByIdAndUpdate(id, { $set: { document: ctx.state.document } }, { new: true });

		ctx.body = { status: 'ok' };
	},

	async downloadXmlFile(ctx) {
		ctx.response.type = '.xml';
		ctx.set({
			'Content-disposition': `attachment; filename=${ctx.state.name}`
		});
		ctx.body = js2xml(ctx.state.document, { spaces: 4, fullTagEmptyElement: true });
	}
};
