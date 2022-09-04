function tabHandler(event) {
	if (event.target.classList.contains('tab')) {
		let activeTab = event.target.parentElement.getElementsByClassName('active')[0];
		activeTab.classList.remove('active');
		event.target.classList.add('active');
		if (event.target.id === 'animals') {
			document.getElementById('newRequestTab').style.display = 'none';
			document.getElementById('animalsTab').style.display = 'flex';
			updateRequests();
		}
		if (event.target.id === 'newRequest') {
			document.getElementById('animalsTab').style.display = 'none';
			document.getElementById('newRequestTab').style.display = 'flex';
			if (document.getElementById('populatedForm')) {
				document.getElementById('populatedForm').remove();
			}
			document.getElementById('animalForm').appendChild(defaultForm);
		}
	}
}