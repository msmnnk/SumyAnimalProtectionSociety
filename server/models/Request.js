const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RequestSchema = new Schema({
	reqType: {
		type: String,
		enum : ['Загублено','Знайдено'],
		required: true
	},
	kind: {
		type: String,
		enum : ['Собака','Кішка'],
		required: true
	},
	sex: {
		type: String,
		enum : ['Хлопчик','Дівчинка'],
		required: true
	},
	name: {
		type: String,
		default: null
	},
	color: {
		type: String,
		default: null
	},
	age: {
		type: String,
		default: null
	},
	breed: {
		type: String,
		default: null
	},
	number: {
		type: String,
		default: null
	},
	description: {
		type: String,
		default: null
	},
	coordinates: {
		lat: Number,
		lng: Number
	},
	photo: {
		type: String,
		required: true
	},
	shelter: {
		type: Schema.Types.ObjectId,
		ref: 'Shelter',
		default: null
	}
},{ versionKey: false });

module.exports = mongoose.model('Request', RequestSchema);