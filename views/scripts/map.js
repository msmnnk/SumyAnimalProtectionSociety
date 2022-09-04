let centerLat = 50.907688;
let centerLong = 34.796716;
let selectedPoint = {};
let marker;
let map;
let animalMap;
let animalsMarkers = [];

window.onload = function() {
	map = L.map('map').setView([centerLat, centerLong], 13);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	let circle = L.circle([50.907688, 34.796716], {
		color: 'yellow',
		fillColor: 'yellow',
		fillOpacity: 0.08,
		radius: 5000
	}).addTo(map);

	map.on('click', function(e){
		let center = {
			lat: centerLat,
			lng: centerLong,
		}
		let point = {
			lat: e.latlng.lat,
			lng: e.latlng.lng,
		}
	
		if(getDistance(center, point) <= 5000) {
			if (marker) {
				marker.remove()
			}
			marker = L.marker(e.latlng).addTo(map);
			selectedPoint = point;
		}
	});

	animalMap = L.map('animalMap').setView([centerLat, centerLong], 13);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(animalMap);
	document.getElementById('animalsTab').style.display = 'none';// fix for map loading
}

function addMarker(request) {
	let icon = getIcon(request.reqType, request.kind);
	let marker = L.marker([request.coordinates.lat, request.coordinates.lng], {icon: icon});
	let description = request.description;
	let popupText = '<div class="popup"><img class="popup-image" src="'+ request.photo +'"></br><p>'+ description +'</p></div>';
	marker.bindPopup(popupText);
	marker.on('click', function(e) {
		openAnimalForm(request);
	});
	animalsMarkers.push(marker);
	return marker;
}

function clearMap() {
	for (let i = 0; i < animalsMarkers.length; i++) {
		animalsMarkers[i].remove();
	}
	animalsMarkers = [];
}

function getIcon(reqType, kind) {
	let iconName = '';
	if (reqType === 'Загублено') {
		iconName = 'lost';
	}	else if (reqType === 'Знайдено') {
		iconName = 'found';
	}
	if (kind === 'Кішка') {
		iconName += 'Cat';
	} else if (kind === 'Собака') {
		iconName += 'Dog';
	}
	return L.icon({
		iconUrl: 'resources/' + iconName + '.png',
		iconSize: [40, 40],
		iconAnchor: [20, 20],
	});
}

function getSelectedCoordinates() {
	if (selectedPoint.lat && selectedPoint.lng) {
		return selectedPoint;
	} else {
		return null;
	}
}

function removeSelectedCoordinates() {
	if (marker) {
		marker.remove();
		selectedPoint = {}
	}
}