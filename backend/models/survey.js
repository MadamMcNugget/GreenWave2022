const mongoose = require('mongoose');

const surveySchema = mongoose.Schema({
	dateOfCreation: { type: Date, required: true },
	edittedBy: { type: String /*mongoose.Schema.Types.ObjectId, ref: "User"*/ },	//TODO: change back to "user" when ready
	section: [{
		title: { type: String, required: true },
		questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
	}]
});

module.exports = mongoose.model('Survey', surveySchema); 