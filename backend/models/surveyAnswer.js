const mongoose = require('mongoose');

const surveyAnswerSchema = mongoose.Schema({
	name: { type: String, required: true},
	address: { type: String },
	dateOfCreation: { type: Date, required: true },
	submittedBy: { type: String /*mongoose.Schema.Types.ObjectId, ref: "User"*/ },	//TODO: change back to "user" when ready
	answers: [{
		questionID: { type: String, required: true },
		response: [{ type: String }]
	}]
});

module.exports = mongoose.model('surveyAnswer', surveyAnswerSchema); 