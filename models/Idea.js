const mongoose = require('mongoose');

const Schema = mongoose.Schema,
  	ObjectId = Schema.ObjectId;

//Create schema
const IdeaSchema = new Schema({
	title: {
		type: String,
		require: true
	},
	details: {
		type: String,
		require: true
	},
	user: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

var IdeaModel = mongoose.model('ideas', IdeaSchema);
module.exports = IdeaModel;