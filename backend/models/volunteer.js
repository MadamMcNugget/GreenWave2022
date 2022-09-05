const mongoose = require('mongoose');

const volunteerSchema = mongoose.Schema({
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String, required: true, unique: true},
	phoneNumber: { type: String },
	address: { type: String },
	intake: { type: Boolean, default: false },
	roles: {
		footCanvass: { type: Boolean, default: false },
		phoneCanvass: { type: Boolean, default: false },
		office: { type: Boolean, default: false },
		hosting: { type: Boolean, default: false },
		events: { type: Boolean, default: false },
		smc: { type: Boolean, default: false },
		signposter: { type: Boolean, default: false },
		photographer: { type: Boolean, default: false },
		core: { type: Boolean, default: false }
	},
	notes: { type: String }
});

module.exports = mongoose.model('Volunteer', volunteerSchema); 