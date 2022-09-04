//convert degrees to radians
function rad(x) {
	return x * Math.PI / 180;
}

// get distance between two points in meters
function getDistance(p1, p2) {
	let R = 6378137;
	let dLat = rad(p2.lat - p1.lat);
	let dLong = rad(p2.lng - p1.lng);
	let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
		Math.sin(dLong / 2) * Math.sin(dLong / 2);
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	let d = R * c;
	return d;
}