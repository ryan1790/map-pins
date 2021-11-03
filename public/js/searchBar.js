const filter = document.querySelector('#filter');
const author = document.querySelector('#author');
const search = document.querySelector('#search');

function query() {
	let address = window.location.href;
	let queryString = '?';
	if (address.indexOf('?') > 1) {
		address = address.split('?')[0];
	}
	if (filter.value) {
		queryString = queryString + `filter=${filter.value}`;
	}

	if (filter.value && author.value) {
		queryString = queryString + '&';
	}

	if (author.value) {
		queryString = queryString + `author=${author.value}`;
	}

	window.location.href = address + queryString;
}

function onEnter(e) {
	if (e.key === 'Enter') {
		query();
	}
}

search.addEventListener('click', query);
filter.addEventListener('keypress', onEnter);
author.addEventListener('keypress', onEnter);
