'use strict';

const mongoose = require('./index');

const documentSchema = new mongoose.Schema(
	{
		name: String,
		document: {}
	},
	{
		timestamps: true
	}
);

documentSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) { delete ret._id }
});

module.exports = mongoose.model('document', documentSchema);
