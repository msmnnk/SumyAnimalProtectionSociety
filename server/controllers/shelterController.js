const Shelter = require('../models/Shelter');

const ShelterController = {
	getById(id) {
		return Shelter.findById(id);
	},
	createNew(shelterData) {
		let shelter = new Shelter(shelterData);
		return shelter.save();
	},
	getAll() {
		return Shelter.find({});
	},
	deleteShelter(id) {
		return Shelter.findByIdAndRemove(id);
	}
}

module.exports = ShelterController;