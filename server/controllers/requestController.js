const Request = require('../models/Request');

const RequestController = {
	createNew(requestData) {
		let request = new Request(requestData);
		return request.save();
	},
	getAll() {
		return Request.find({});
	},
	updateRequest(requestData) {
		return Request.findByIdAndUpdate(requestData._id, requestData);
	},
	deleteRequest(id) {
		return Request.findByIdAndRemove(id);
	}
}

module.exports = RequestController;