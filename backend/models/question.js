const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
	question: { type: String, required: true },
	responseType: { type: String, required: true },
	responses: [
		{ 
			response: { type: String },
			goto: { type: String}
		},
	],
	gotoEnabled: { type: Boolean, required: true},
	edittable: { type: Boolean, default: true } 
});

module.exports = mongoose.model('Question', questionSchema); 