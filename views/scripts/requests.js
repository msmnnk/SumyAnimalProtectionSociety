let animals = [];
let defaultForm = document.createElement('p');
defaultForm.innerHTML = 'Оберіть маркер на карті'
defaultForm.id = 'defaultForm';
document.getElementById('animalForm').appendChild(defaultForm);

function updateRequests() {
	fetch('/api/getAllRequests')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			clearMap();
			animals = data.requests;
			for (let i = 0; i < data.requests.length; i++) {
				let marker = addMarker(data.requests[i]);
				marker.addTo(animalMap);
			}
		}).catch((err) => {
			Toastify({
				text: '⚠️ Щось пішло не так :(',
				duration: 2000,
				gravity: 'bottom',
				position: 'center',
				stopOnFocus: true,
				className: 'toast-error'
			}).showToast();
		});
}

function openAnimalForm(request) {
	document.getElementById('animalForm').innerHTML = '';
	let form = document.createElement('div');
	form.id = 'populatedForm';

	let name = document.createElement('div');
	name.innerHTML = request.name;
	name.classList.add('info-name', 'info-div');

	let type = document.createElement('div');
	type.innerHTML = request.reqType;
	type.classList.add('info-type', 'info-div');

	let age = document.createElement('div');
	if (request.age === '') {
		age.innerHTML = 'не вказано';
	} else {
		age.innerHTML = request.age;
	}
	age.classList.add('info-age', 'info-div');

	let breed = document.createElement('div');
	if (request.breed === '') {
		breed.innerHTML = 'не вказано';
	} else {
		breed.innerHTML = request.breed;
	}
	breed.classList.add('info-breed', 'info-div');

	let color = document.createElement('div');
	if (request.color === '') {
		color.innerHTML = 'не вказано';
	} else {
		color.innerHTML = request.color;
	}
	color.classList.add('info-color', 'info-div');

	let description = document.createElement('div');
	if (request.description === '') {
		description.innerHTML = 'немає';
	} else {
		description.innerHTML = request.description;
	}
	description.classList.add('info-description', 'info-div');

	let kind = document.createElement('div');
	kind.innerHTML = request.kind;
	kind.classList.add('info-kind', 'info-div');

	let number = document.createElement('div');
	number.innerHTML = request.number;
	number.classList.add('info-number', 'info-div');

	let photo = document.createElement('img');
	photo.setAttribute('src', request.photo);
	photo.classList.add('info-photo', 'info-div');

	let sex = document.createElement('div');
	sex.innerHTML = request.sex;
	sex.classList.add('info-sex', 'info-div');

	let tagContainer = document.createElement('div');
	tagContainer.classList.add('info-tags');
	tagContainer.appendChild(type);
	tagContainer.appendChild(kind);
	tagContainer.appendChild(sex);

	form.appendChild(tagContainer);
	form.appendChild(photo);
	if (request.reqType === 'Загублено') {
		form.appendChild(name);
		form.appendChild(age);
	}
	form.appendChild(breed);
	form.appendChild(color);
	form.appendChild(number);
	form.appendChild(description);

	if (request.shelter) {
		fetch('/api/getShelterById/?id=' + request.shelter, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
				}
			})
			.then((response) => {return response.json();})
			.then((data) => {
				let shelter = document.createElement('div');
				shelter.innerHTML = data.shelter.name + ' / ' + data.shelter.address;
				shelter.classList.add('info-shelter', 'info-div');
				form.appendChild(shelter);
			}
			).catch((err) => {
				Toastify({
					text: '⚠️ Щось пішло не так :(',
					duration: 2000,
					gravity: 'bottom',
					position: 'center',
					stopOnFocus: true,
					className: 'toast-error'
				}).showToast();
			}
			);
		
	}

	document.getElementById('animalForm').appendChild(form);
}