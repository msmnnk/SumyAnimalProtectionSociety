const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ShelterSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	}
},{ versionKey: false });

module.exports = mongoose.model('Shelter', ShelterSchema);