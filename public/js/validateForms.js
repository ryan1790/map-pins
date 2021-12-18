(function() {
	'use strict';

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll('.validated-form');
	const selfEnter = document.querySelector('#self-enter-value');
	const lng = document.querySelector('#longitude');
	const lat = document.querySelector('#latitude');
	const oldPass = document.querySelector('#oldPassword');
	const newPass = document.querySelector('#newPassword');
	const confirmPass = document.querySelector('#confirmPassword');
	const body = document.querySelector('#body');

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
					lng.setCustomValidity('Must have valid entry');
					lat.setCustomValidity('Must have valid entry');
				} else if (selfEnter && selfEnter.checked && (lng.value && lat.value)) {
					lng.setCustomValidity('');
					lat.setCustomValidity('');
				}

				if (oldPass && oldPass.value) {
					if (newPass.value.length === 0 || newPass.value !== confirmPass.value) {
						event.preventDefault();
						event.stopPropagation();
						confirmPass.setCustomValidity('Passwords do not match');
						newPass.setCustomValidity('Passwords do not match');
					} else if (newPass.value === confirmPass.value) {
						confirmPass.setCustomValidity('');
						newPass.setCustomValidity('');
					}
				}

				if (body) {
					const rating = document.querySelector('input[name="comment[rating]"]:checked');
					if (!rating) {
						if (body.value.length < 5) {
							event.preventDefault();
							event.stopPropagation();
						}
						if (body.value.length === 0) {
							body.setCustomValidity('Comment must have text');
						} else if (body.value.length < 5) {
							body.setCustomValidity('Comment must be longer');
						} else {
							body.setCustomValidity('');
						}
					}

					if (rating) {
						console.log(rating.value);
						if (![ '1', '2', '3', '4', '5' ].includes(rating.value)) {
							if (body.value.length < 5) {
								event.preventDefault();
								event.stopPropagation();
							}
							if (body.value.length === 0) {
								body.setCustomValidity('Must include at least comment or rating');
							} else if (body.value.length < 5) {
								body.setCustomValidity('Comment must be longer');
							} else {
								body.setCustomValidity('');
							}
						} else {
							body.setCustomValidity('');
						}
					}
				}

				form.classList.add('was-validated');
			},
			false
		);
	});
})();
