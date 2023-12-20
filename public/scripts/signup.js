const getElement = (id) => document.getElementById(id);
const form = getElement('myForm');

const userSignUpInfo = {};
const formDataObject = {};

const path = window.location.pathname;
const match = path.match(/\/signup\/([^\/?]+)\/([^\/?]+)?/);
const circleId = match ? match[1] : null;

submitBtn.addEventListener('click', async function (event) {
    const isFormValid = form.checkValidity();
    const isEmailValid = await validateEmail();

    if (!isFormValid) {
        handleInvalidForm();
    } else {
        if (!isEmailValid) {
            const formData = new FormData(form);
            formData.forEach((value, key) => (formDataObject[key] = value));

            if (circleId) {
                formData.append('circleId', circleId);
                await submitFormData('/api/v1/auth/signup', formData);
            } else {
                formDataObject.role = "CREATOR";
                sessionStorage.setItem('formData', JSON.stringify(formDataObject));
                location.assign('/create-circle');
            }
        }
    }
});

async function validateEmail() {
    try {
        const emailElement = getElement('email');

        const response = await fetch('/api/v1/validate-email', {
            method: 'POST',
            body: JSON.stringify({ email: emailElement.value }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const spanToDisplayERr = emailElement.nextElementSibling;
            const data = await response.json();

            spanToDisplayERr.textContent = data.message;

            return true;
        }
        else {
            return false;
        }

    } catch (error) {
        return false;
    }
}

function handleInvalidForm() {
    const invalidElements = form.querySelectorAll(':invalid');
    invalidElements.forEach((element) => {
        const errorSpan = element.nextElementSibling;
        errorSpan.textContent = element.validationMessage || 'Invalid value';
    });
}

async function submitFormData(url, formData) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (response.status === 201) {
            const createdUser = await response.json();
            sessionStorage.setItem('createdUser', JSON.stringify(createdUser));
            location.assign('/home');
        } if (response.status === 400) {
            const data = await response.json();
        }
    } catch (err) {
        console.log(err);
    }
}


cancelBtn.addEventListener('click', () => {
    location.assign('/');
});