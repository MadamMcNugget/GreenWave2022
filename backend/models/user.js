const mongoose = require('mongoose');
//const Order = require('mongoose').model('Order').schema;
const uniqueValidator = require('mongoose-unique-validator');	// used as plugin, a feature provided by mongoose.  checks data before saving to database

const userSchema = mongoose.Schema({
	//username: { type: String, required: true, unique: true },	// does not automatically validate, just allows mongoose and mongoDB to perform internal optimizations
	email: { type: String, required: true, unique: true },		// fortunately, there is package for this -->  npm install --save mongoose-unique-validator
	password: { type: String, required: true },
	status: { type: String, default: 'unverified' },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);  //name of the model, schema you wanna use.  export means that this model can be used outside of this file