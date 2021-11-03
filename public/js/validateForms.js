(function() {
	'use strict';

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll('.validated-form');
	const selfEnter = document.querySelector('#self-enter-value');
	const lng = document.querySelector('#longitude');
	const lat = document.querySelector('#latitude');

	// Loop over them and prevent submission
	Array.from(forms).forEach(function(form) {
		form.addEventListener(
			'submit',
			function(event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				if (selfEnter && selfEnter.checked && !(lng.value && lat.value)) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add('was-validated');
			},
			false
		);
	});
})();
