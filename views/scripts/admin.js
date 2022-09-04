let requests = [];
let shelters = [];
let currentRequest = null;

window.onload = function() {
	checkToken();
	fillList();
	getShelters();
}

function getShelters() {
	fetch('api/getShelters', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'authorization': localStorage.getItem('token')
			}
		})
		.then(response => response.json())
		.then(data => {
			shelters = data.shelters;
			if (currentRequest !== null) {
				fillForm(currentRequest);
			}
		})
		.catch(error => console.error(error)
	);
}

function fillList() {
	fetch('/api/getAllRequests', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(response => response.json())
	.then(data => {
		if (data.status === 'ok') {
			requests = data.requests;
			let list = document.getElementById('requestsList');
			list.innerHTML = '';
			requests.forEach(request => {
				addListItem(list, request);
			});
		}
	}).catch((err) => {
		alert('Connection error');
	});
}

function addListItem(list, request) {
	let listItem = document.createElement('div');
	listItem.classList.add('list-item');
	listItem.id = request._id;

	let itemImage = document.createElement('img');
	itemImage.src = request.photo;
	itemImage.classList.add('list-item-image');

	let itemKind = document.createElement('div');
	itemKind.classList.add('list-item-kind');
	itemKind.innerText = request.kind === 'Собака' ? '🐶' : '🐱';

	let itemSex = document.createElement('div');
	itemSex.classList.add('list-item-sex');
	itemSex.innerText = request.sex === 'Хлопчик' ? '🚹' : '🚺';

	let itemPhone = document.createElement('div');
	itemPhone.classList.add('list-item-phone');
	itemPhone.innerText = request.number;

	let deleteItem = document.createElement('div');
	deleteItem.classList.add('list-item-delete-btn');
	deleteItem.innerText = '❌';
	deleteItem.onclick = (event) => {
		deleteRequest(event.target.parentElement.id);
	}

	let infoContainer = document.createElement('div');
	infoContainer.classList.add('list-item-info-container');
	infoContainer.onclick = (event) => {
		openRequest(event.target);
	}

	infoContainer.appendChild(itemImage);
	infoContainer.appendChild(itemKind);
	infoContainer.appendChild(itemSex);
	infoContainer.appendChild(itemPhone);
	listItem.appendChild(infoContainer);
	listItem.appendChild(deleteItem);
	list.appendChild(listItem);
}

function openRequest(target) {
	let requestId;
	if (target.classList.contains('list-item-info-container')) {
		requestId = target.parentElement.id;
	} else {
		requestId = target.parentElement.parentElement.id;
	}
	let request = requests.find(request => request._id === requestId);
	currentRequest = request;
	fillForm(request);
}

function deleteRequest(id) {
	if (confirm('delete item?')) {
		fetch('/api/deleteRequest', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'authorization': localStorage.getItem('token')
			},
			body: JSON.stringify({
				id: id
			})
		}).then(response => response.json())
		.then(data => {
			if (data.status === 'ok') {
				fillList();
			}
		}).catch((err) => {
			alert('Connection error');
		});
	}
}

function updateRequest() {
	let request = requests.find(request => request._id === document.getElementById('infoForm').getAttribute('data-id'));
	request.reqType = document.getElementsByClassName('form-type')[0].value;
	request.kind = document.getElementsByClassName('form-kind')[0].value;
	request.sex = document.getElementsByClassName('form-sex')[0].value;
	request.name = document.getElementsByClassName('form-name')[0].value;
	request.age = document.getElementsByClassName('form-age')[0].value;
	request.breed = document.getElementsByClassName('form-breed')[0].value;
	request.color = document.getElementsByClassName('form-color')[0].value;
	request.number = document.getElementsByClassName('form-phone')[0].value;
	request.description = document.getElementsByClassName('form-description')[0].value;
	request.shelter = document.getElementsByClassName('form-shelter')[0].value;

	fetch('/api/updateRequest', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'authorization': localStorage.getItem('token')
		},
		body: JSON.stringify(request)
	}).then(response => response.json())
	.then(data => {
		if (data.status === 'ok') {
			fillList();
		}
	}).catch((err) => {
		alert('Connection error');
	});
}

function fillForm(request) {
	let form = document.getElementById('infoForm');
	form.setAttribute('data-id', request._id);
	form.innerHTML = '';
	let formTitle = document.createElement('h2');
	formTitle.innerText = 'Заявка № ' + request._id;
	form.appendChild(formTitle);

	let formPhoto = document.createElement('img');
	formPhoto.src = request.photo;
	formPhoto.classList.add('form-photo');
	form.appendChild(formPhoto);

	let formType = document.createElement('select');
	formType.classList.add('form-type');
	let lostOption = document.createElement('option');
	lostOption.value = 'Загублено';
	lostOption.innerText = 'Загублено';
	let foundOption = document.createElement('option');
	foundOption.value = 'Знайдено';
	foundOption.innerText = 'Знайдено';
	formType.appendChild(lostOption);
	formType.appendChild(foundOption);
	form.appendChild(formType);
	formType.value = request.reqType;

	let formKind = document.createElement('select');
	formKind.classList.add('form-kind');
	let DogOption = document.createElement('option');
	DogOption.value = 'Собака';
	DogOption.innerText = 'Собака';
	let CatOption = document.createElement('option');
	CatOption.value = 'Кішка';
	CatOption.innerText = 'Кішка';
	formKind.appendChild(DogOption);
	formKind.appendChild(CatOption);
	form.appendChild(formKind);
	formKind.value = request.kind;

	let formSex = document.createElement('select');
	formSex.classList.add('form-sex');
	let maleOption = document.createElement('option');
	maleOption.value = 'Хлопчик';
	maleOption.innerText = 'Хлопчик';
	let femaleOption = document.createElement('option');
	femaleOption.value = 'Дівчинка';
	femaleOption.innerText = 'Дівчинка';
	formSex.appendChild(maleOption);
	formSex.appendChild(femaleOption);
	form.appendChild(formSex);
	formSex.value = request.sex

	let formName = document.createElement('input');
	formName.classList.add('form-name');
	formName.name = 'name';
	formName.value = request.name;
	formName.placeholder = 'name'
	form.appendChild(formName);

	let formAge = document.createElement('input');
	formAge.classList.add('form-age');
	formAge.name = 'age';
	formAge.value = request.age;
	formAge.placeholder = 'age'
	form.appendChild(formAge);

	let formBreed = document.createElement('input');
	formBreed.classList.add('form-breed');
	formBreed.name = 'breed';
	formBreed.value = request.breed;
	formBreed.placeholder = 'breed'
	form.appendChild(formBreed);

	let formColor = document.createElement('input');
	formColor.classList.add('form-color');
	formColor.name = 'color';
	formColor.value = request.color;
	formColor.placeholder = 'color'
	form.appendChild(formColor);

	let formPhone = document.createElement('input');
	formPhone.classList.add('form-phone');
	formPhone.name = 'phone';
	formPhone.value = request.number;
	formPhone.placeholder = 'phone'
	form.appendChild(formPhone);

	let formDescription = document.createElement('textarea');
	formDescription.classList.add('form-description');
	formDescription.name = 'description';
	formDescription.value = request.description;
	formDescription.placeholder = 'description'
	form.appendChild(formDescription);

	let formShelter = document.createElement('select');
	formShelter.classList.add('form-shelter');
	for (let shelter of shelters) {
		let option = document.createElement('option');
		option.value = shelter._id;
		option.innerText = shelter.name + ' ' + shelter.address;
		formShelter.appendChild(option);
	}
	formShelter.value = request.shelter;
	let formShelterButton = document.createElement('button');
	formShelterButton.classList.add('form-shelter-button');
	formShelterButton.innerText = 'Перетримки';
	formShelterButton.addEventListener('click', () => {
		openShelters();
	});

	let formSheltercontainer = document.createElement('div');
	formSheltercontainer.classList.add('form-sheltercontainer');

	formSheltercontainer.appendChild(formShelter);
	formSheltercontainer.appendChild(formShelterButton);
	form.appendChild(formSheltercontainer);

	let sheltersList = document.createElement('div');
	sheltersList.id = 'sheltersList';
	sheltersList.style.display = 'none';
	form.appendChild(sheltersList);

	let formSubmit = document.createElement('input');
	formSubmit.type = 'submit';
	formSubmit.value = 'Зберегти';
	formSubmit.classList.add('form-submit');
	formSubmit.onclick = (event) => {
		event.preventDefault();
		updateRequest();
	};
	form.appendChild(formSubmit);
}

function openShelters() {
	let sheltersList = document.getElementById('sheltersList');
	if (sheltersList.style.display === 'none') {
		sheltersList.style.display = 'flex';
		sheltersList.innerHTML = '';
		let list = document.createElement('div');
		list.classList.add('shelters-list');
		for (let shelter of shelters) {
			let shelterItem = document.createElement('div');
			shelterItem.classList.add('shelter-item');
			shelterItem.innerText = shelter.name + ' / ' + shelter.address;
			let deleteButton = document.createElement('button');
			deleteButton.classList.add('delete-button');
			deleteButton.innerText = '❌';
			deleteButton.addEventListener('click', (event) => {
				deleteShelter(shelter._id, event.target.parentElement);
			});
			shelterItem.appendChild(deleteButton);
			list.appendChild(shelterItem);
			sheltersList.appendChild(list);
		}

		let form = document.createElement('div')
		form.classList.add('shelters-form');

		let formName = document.createElement('input');
		formName.classList.add('form-name');
		formName.id = 'shelterName';
		formName.name = 'name';
		formName.placeholder = 'name'
		form.appendChild(formName);

		let formAddress = document.createElement('input');
		formAddress.classList.add('form-address');
		formAddress.id = 'formAddress';
		formAddress.name = 'address';
		formAddress.placeholder = 'address'
		form.appendChild(formAddress);

		let formSubmit = document.createElement('input');
		formSubmit.type = 'submit';
		formSubmit.value = 'Додати';
		formSubmit.classList.add('form-submit');
		formSubmit.onclick = (event) => {
			event.preventDefault();
			addShelter();
		};
		form.appendChild(formSubmit);

		sheltersList.appendChild(form);
	} else {
		sheltersList.style.display = 'none';
	}
}

function addShelter() {
	let name = document.getElementById('shelterName').value;
	let address = document.getElementById('formAddress').value;
	let shelter = {
		name: name,
		address: address
	};
	fetch('/api/addShelter', {
		method: 'POST',
		body: JSON.stringify(shelter),
		headers: {
			'Content-Type': 'application/json',
			'authorization': localStorage.getItem('token')
		}
	}).then(() => {
		getShelters();
	}).catch(error => {
		alert(error);
	});
}

function deleteShelter(id, element) {
	if (confirm('Ви впевнені, що хочете видалити перетримку?')) {
		fetch('/api/deleteShelter', {
			method: 'POST',
			body: JSON.stringify({
				id: id
			}),
			headers: {
				'Content-Type': 'application/json',
				'authorization': localStorage.getItem('token')
			}
		}).then(() => {
			element.remove();
			let select = document.getElementsByClassName('form-shelter')[0].options;
			for (let i = 0; i < select.length; i++) {
				if (select[i].value === id) {
					select[i].remove();
				}
			}
		}).catch(error => {
			alert(error);
		});
	}
}

function login(event) {
	event.preventDefault();
	let form = new FormData(event.target);
	fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
				username: form.get('username'),
				password: form.get('password')
			})
	}).then(response => response.json())
	.then(data => {
		if (data.status === 'ok') {
			localStorage.setItem('token', data.token);
			showContent();
		} else {
			alert('Wrong username or password');
		}
	}).catch((err) => {
		alert('Connection error');
	});
}

function logout() {
	localStorage.removeItem('token');
	showLoginForm();
}

function checkToken(){
	let token = localStorage.getItem('token');
	if (token) {
		fetch('/api/checkToken', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({token: token})
		}).then(response => response.json())
		.then(data => {
			if (data.status === 'ok') {
				showContent();
			} else {
				showLoginForm();
			}
		}).catch((err) => {
			showLoginForm();
		});
	} else {
		showLoginForm();
	}
}

function showLoginForm() {
	document.getElementById('loginForm').style.display = 'flex';
	document.getElementById('content').style.display = 'none';
}

function showContent() {
	document.getElementById('loginForm').style.display = 'none';
	document.getElementById('content').style.display = 'flex';
}