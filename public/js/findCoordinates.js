const enterLng = document.querySelector('#longitude');
const enterLat = document.querySelector('#latitude');
const selfEnterValue = document.querySelector('#self-enter-value');
const openModal = document.querySelector('#findCoordinates');
const pinLocation = document.querySelector('#location');
const coordinateList = document.querySelector('#coordinate-list');
const cancelButton = document.querySelector('#cancel');
const closeButton = document.querySelector('#close');
const revertButton = document.querySelector('#revert');
const undoButton = document.querySelector('#undo');
const selectButton = document.querySelector('#select');
const manualCoordinates = document.querySelector('#manual-coordinates');

const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
let marker;
const mapMarkers = [];

let center = [ 90, 90 ];
if (enterLng.value && enterLat.value) center = [ enterLng.value, enterLat.value ];

mapboxgl.accessToken = accessToken;
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/ryan301/ckjbeyqhd4irn19mcmg3fmkvx', // stylesheet location
	center, // starting position [lng, lat]
	zoom: 4 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const newMarker = lngLat => {
	const popup = new mapboxgl.Popup({ offset: 25 }).setText('Self-Enter Coordinates');
	return new mapboxgl.Marker().setLngLat(lngLat).setPopup(popup).addTo(map);
};

const fetchCoordinates = query => {
	const queryURI = encodeURI(query);
	const requestURL = `${url}/${queryURI}.json?limit=3&access_token=${accessToken}`;
	return axios.get(requestURL);
};

const mapFormOption = ({ location, coordinates }) => {
	const popup = new mapboxgl.Popup({ offset: 25 }).setText(`${location}`);
	return new mapboxgl.Marker().setLngLat(coordinates).setPopup(popup).addTo(map);
};

const createFormOption = ({ location, coordinates, count }) => {
	const container = document.createElement('div');
	container.classList.add('form-check', 'found-coordinates');

	const input = document.createElement('input');
	input.classList.add('form-check-input');
	input.setAttribute('type', 'radio');
	input.setAttribute('name', 'coordinates');
	input.setAttribute('id', `result-${count}`);
	input.setAttribute('value', JSON.stringify(coordinates));

	const label = document.createElement('label');
	label.classList.add('form-check-label');
	label.setAttribute('for', `result-${count}`);
	const labelText = document.createTextNode(location);

	label.appendChild(labelText);
	container.appendChild(input);
	container.appendChild(label);
	coordinateList.appendChild(container);

	container.addEventListener('click', () => map.flyTo({ center: coordinates }));
};

const updateSelfValue = () => (selfEnterValue.value = `[ ${enterLng.value}, ${enterLat.value} ]`);

const mapSelfEnter = () => {
	if (enterLng.value && enterLat.value) {
		try {
			const createMarker = newMarker([ enterLng.value, enterLat.value ]);
			if (marker) marker.remove();
			marker = createMarker;
		} catch (err) {}
	}
};

const resetCoordinateForm = () => {
	const coordinateElements = document.querySelectorAll('.found-coordinates');
	for (let element of coordinateElements) {
		element.remove();
	}
	for (let point of mapMarkers) {
		point.remove();
	}
	mapMarkers.splice(0, mapMarkers.length);
};

const revertCoordinateForm = () => {
	resetCoordinateForm();
	enterLng = pin.geometry.coordinates[0];
	enterLat = pin.geometry.coordinates[1];
	updateSelfValue();
	mapSelfEnter();
	selfEnterValue.checked = true;
};

const select = () => {
	const coordinateElements = document.querySelectorAll('.form-check-input');
	for (let coordinates of coordinateElements) {
		if (coordinates.checked) {
			const geo = JSON.parse(coordinates.value);
			resetCoordinateForm();
			enterLng.value = Math.round(100 * geo[0]) / 100;
			enterLat.value = Math.round(100 * geo[1]) / 100;
			updateSelfValue();
			mapSelfEnter();
			selfEnterValue.checked = true;
			return;
		}
	}
};

openModal.addEventListener('click', async () => {
	if (pinLocation.value) {
		try {
			const response = await fetchCoordinates(pinLocation.value);
			let i = 1;
			for (let result of response.data.features) {
				const data = {
					location: result.place_name,
					coordinates: [
						Math.round(100 * result.geometry.coordinates[0]) / 100,
						Math.round(100 * result.geometry.coordinates[1]) / 100
					],
					count: i
				};
				createFormOption(data);
				const mapMarker = mapFormOption(data);
				mapMarkers.push(mapMarker);
				i++;
			}
		} catch (err) {
			console.log(err);
		}
	} else {
	}
});

map.on('mousedown', e => {
	if (e.originalEvent && e.originalEvent.which === 3) {
		const { lng, lat } = e.lngLat;
		enterLng.value = Math.round(lng * 100) / 100;
		enterLat.value = Math.round(lat * 100) / 100;
		updateSelfValue();
		if (marker) marker.remove();
		marker = newMarker(e.lngLat);
	}
});

enterLng.addEventListener('input', updateSelfValue);
enterLat.addEventListener('input', updateSelfValue);
enterLng.addEventListener('change', mapSelfEnter);
enterLat.addEventListener('change', mapSelfEnter);

manualCoordinates.addEventListener('click', () => {
	if (enterLng.value && enterLat.value) {
		map.flyTo({ center: [ enterLng.value, enterLat.value ] });
	}
});

if (cancelButton && closeButton) {
	cancelButton.addEventListener('click', resetCoordinateForm);
	closeButton.addEventListener('click', resetCoordinateForm);
}

if (undoButton && revertButton && selectButton) {
	mapSelfEnter();
	undoButton.addEventListener('click', revertCoordinateForm);
	revertButton.addEventListener('click', revertCoordinateForm);
	selectButton.addEventListener('click', select);
}
