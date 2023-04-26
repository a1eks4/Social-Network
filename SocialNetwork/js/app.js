let session = new Session();
session = session.getSession();

if(session !== "") {
	window.location.href = "hexa.html";
}

// Modal Button
document.querySelector('.registracija').addEventListener("click", () => {
	document.querySelector('.reg-modal').style.display = 'block';
});
document.querySelector('#closeModal').addEventListener("click", () => {
	document.querySelector('.reg-modal').style.display = 'none';
});
// Registration
let config = {
	'korisnicko_ime': {
		required: true,
		minlength: 4,
		maxlength: 20
	},
	'email': {
		required: true,
		email: true,
		minlength: 3,
		maxlength: 30
	},
	'lozinka': {
		required: true,
		minlength: 7,
		maxlength: 25,
		matching: 'ponovi_lozinku'
	},
	'ponovi_lozinku': {
		required: true,
		minlength: 7,
		maxlength: 25,
		matching: 'lozinka'
	}
};
let validator = new Validator(config, '#registrationform', '#login-form');
document.querySelector('#registrationform').addEventListener("submit", e => {
	e.preventDefault();

	if(validator.validationPassed()) {
		let user = new User();
		user.username = document.querySelector('#korisnicko_ime').value;
		user.email = document.querySelector('#email').value;
		user.password = document.querySelector('#lozinka').value;
		user.create();

	}
	else {
		alert('Nije ok');
	}
});
// login
document.querySelector('#login-form').addEventListener("submit", e => {
	e.preventDefault();

	let email = document.querySelector('#login_email').value;
	let password = document.querySelector('#login_lozinka').value;
	let user = new User();
	user.email = email;
	user.password = password;
	user.login();
});