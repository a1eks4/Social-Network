class Validator {
	constructor(config) {
		this.elementsConfig = config;
		this.errors = {};
		this.generateErrorsObject();
		this.inputListener();
	}
	generateErrorsObject() {
		for(let field in this.elementsConfig) {
			this.errors[field] = [];
		}
	}
	inputListener() {
		let inputSelector = this.elementsConfig;

		for(let field in inputSelector) {
			let ell = document.querySelector(`input[name="${field}"]`);

			ell.addEventListener("input", this.validate.bind(this));
		}
	}
	validate(e) {
		let elFields = this.elementsConfig;

		let field = e.target;
		let fieldName = field.getAttribute('name');
		let fieldValue = field.value;
		this.errors[fieldName] = [];
		if(elFields[fieldName].required) {
			if(fieldValue === '') {
				this.errors[fieldName].push('Polje je prazno!');
			}
		}
		if(elFields[fieldName].email) {
			if(this.validateEmail(fieldValue) !== true) {
				this.errors[fieldName].push('Neispravna email adresa');
			}
		}
		if(fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength) {
			this.errors[fieldName].push(`Polje mora imati minimalno ${elFields[fieldName].minlength} i maksimalno ${elFields[fieldName].maxlength} karaktera`);
		}
		if(elFields[fieldName].matching) {
			let matchingEl = document.querySelector(`input[name="${elFields[fieldName].matching}"]`);
			if(this.errors[fieldName].length === 0 || fieldValue === matchingEl.value) {
				this.errors[fieldName] = [];
				this.errors[elFields[fieldName].matching] = [];
			}
			else if(fieldValue !== matchingEl.value) {
				this.errors[fieldName].push('Lozinke se ne poklapaju');
			}		
		}
		this.populateErrors(this.errors);
	}
	validationPassed() {
		for(let key of Object.keys(this.errors)) {
			if(this.errors[key].length > 0) {
				return false;
			}
			else {
				return true;
			}	
		}		
	}
	populateErrors(errors) {
		for(const elem of document.querySelectorAll('ul')) {
			elem.remove();
		}
		for(let key of Object.keys(errors)) {
			let parentElement = document.querySelector(`input[name="${key}"]`).parentElement;
			let errorsElement = document.createElement('ul');
			parentElement.appendChild(errorsElement);

			errors[key].forEach(error => {
				let li = document.createElement('li');
				li.innerText = error;	
				errorsElement.appendChild(li);	
			});
		}
	}
	validateEmail(email) {
		let regx = /^[^ ]+@[^ ]+\.[a-z{2,3}$]/;
		if (regx.test(email)) {
			return true;
		}
		else {
			return false;
		}
	}
}