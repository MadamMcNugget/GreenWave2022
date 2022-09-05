const mongoose = require('mongoose');

const voterSchema = mongoose.Schema({
	name: { type: String, required: true},
	streetName: { type: String },
	houseNum: { type: String },
	aptNum: { type: String },
	city: { type: String },
	poll: { type: String, required: true },
	sequence: { type: Number },
	support: { type: String },
	canvassedBy: { type: String /*mongoose.Schema.Types.ObjectId, ref: "User"*/ },	//TODO: change back to "user" when ready
	canvassedDate: { type: Date },
	answers: [{
		questionID: { type: String },
		response: [{ type: String }]
	}],
	status: { type: String, default: "4uncanvassed" },
	needsManualEntry: { type: Boolean, default: false },
	GVoteLink: { type: String }
});

module.exports = mongoose.model('Voter', voterSchema); 