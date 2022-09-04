function selectorHandler(event) {
	if (event.target.tagName === 'INPUT') {
		let activeElem = event.target.parentElement.getElementsByClassName("selected")[0];
		activeElem.classList.remove('selected');
		event.target.classList.add('selected');
		if (event.target.value === 'Знайдено') {
			document.getElementById('form-name').hidden = true;
			document.getElementById('form-age').hidden = true;
		} else if (event.target.value === 'Загублено') {
			document.getElementById('form-name').hidden = false;
			document.getElementById('form-age').hidden = false;
			document.getElementById('form-name').value = '';
			document.getElementById('form-color').value = '';
		}
	}
}

function getSelectedValue(id) {
	let selected = document.getElementById(id).getElementsByClassName("selected")[0];
	return selected.value;
}

function getFormData() {
	let formData = {};
	formData.reqType = getSelectedValue('form-status');
	formData.kind = getSelectedValue('form-kind');
	formData.sex = getSelectedValue('form-sex');
	formData.name = document.getElementById('form-name').value;
	formData.color = document.getElementById('form-color').value;
	formData.age = document.getElementById('form-age').value;
	formData.breed = document.getElementById('form-breed').value;
	formData.number = document.getElementById('form-number').value;
	formData.description = document.getElementById('form-comment').value;
	formData.coordinates = getSelectedCoordinates();
	formData.photo = document.getElementById('form-photo').files[0] || null;
	return formData;
}

function clearForm() {
	document.getElementById('form-name').value = '';
	document.getElementById('form-color').value = '';
	document.getElementById('form-age').value = '';
	document.getElementById('form-breed').value = '';
	document.getElementById('form-number').value = '';
	document.getElementById('form-comment').value = '';
	removeSelectedCoordinates();
	document.getElementById('form-photo').value = null;
	document.getElementById('file-name').innerHTML = 'До 5 МБ';
}

function fileHandler(event) {
	let file = event.target.files[0];
	if (file.size / 1024 / 1024 < 5) {
		document.getElementById('file-name').innerHTML = file.name;
	} else {
		formData.photo = document.getElementById('form-photo').value = null;
		Toastify({
			text: '⚠️ Фото завелике, виберіть фото менше 5 Мб',
			duration: 3000,
			gravity: 'bottom',
			position: 'center',
			stopOnFocus: true,
			className: 'toast-error'
		}).showToast();
	}
}

function submitHandler(event) {
	event.preventDefault();
	let formData = getFormData();
	if (validateForm(formData)) {
		let form = new FormData()
		form.append('file', formData.photo);
		fetch('api/loadPhoto', {
			method: 'POST',
			body: form
		})
		.then(response => response.json())
		.then(data => {
			formData.photo = data.fileUrl;
			fetch('api/submitRequest', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			})
			.then(response => response.json())
			.then(data => {
				clearForm();
				Toastify({
					text: '✅ Заявка відправлена',
					duration: 2000,
					gravity: 'bottom',
					position: 'center',
					stopOnFocus: true,
					className: 'toast-success'
				}).showToast();
			})
			.catch(error => {
				showValidationError('Щось пішло не так :(');
			});
		})
		.catch(error => {
			showValidationError('Щось пішло не так :(');
		});
	}
}

function validateForm(formData) {
	if (validateField(formData.name, true, 3, 25) == false && formData.reqType === 'Загублено') {
		showValidationError('Прізвисько некоректне (від 3 до 25 символів)');
		return false;
	}
	if (validateField(formData.color, false, 3, 50) == false) {
		showValidationError('Колір некоректний (від 3 до 50 символів)');
		return false;
	}
	if (validateField(formData.age, false, 1, 25) == false) {
		showValidationError('Вік некоректний (від 1 до 25 символів)');
		return false;
	}
	if (validateField(formData.breed, false, 3, 50) == false) {
		showValidationError('Порода некоректна (від 3 до 50 символів)');
		return false;
	}
	if (validateField(formData.number, true, 9, 13) == false || validatePhone(formData.number) == false) {
		showValidationError('Номер некоректний (+380991231212)');
		return false;
	}
	if (validateField(formData.description, false, 3, 500) == false) {
		showValidationError('Опис некоректний (від 3 до 500 символів)');
		return false;
	}
	if (formData.photo == null) {
		showValidationError('Виберіть фото');
		return false;
	}
	if (formData.coordinates == null) {
		showValidationError('Виберіть точку на карті');
		return false;
	}
	return true;
}

function validatePhone(phone) {
	let phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
	return phoneRegex.test(phone);
}

function showValidationError(message) {
	Toastify({
		text: '⚠️ ' + message,
		duration: 2000,
		gravity: 'bottom',
		position: 'center',
		stopOnFocus: true,
		className: 'toast-error'
	}).showToast();
}

function validateField(value, required, minLen, maxLen) {
	let isValid = true;
	if (value.length === 0) {
		isValid = !required;
	} else {
		if (value.length < minLen || value.length > maxLen) {
			isValid = false;
		}
		if (value.includes('<') || value.includes('>')) {
			isValid = false;
		}
	}
	return isValid;
}