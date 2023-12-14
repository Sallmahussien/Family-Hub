const getElement = (id) => document.getElementById(id);
const loginForm = getElement('login');
const submitBtn = getElement('submitBtn');
const spansForErr = document.querySelectorAll('.errMsg')

const loginErrorDisplay = {
    email: getElement('email'),
    password: getElement('password')
}

function redirectToForgetPassword () {
    location.assign('/forget-password');
}

function redirectToSignUp () {
    location.assign('/signup');
}

function redirectToLanding() {
    location.assign('/');
}

submitBtn.addEventListener('click', async () => {
    console.log('listen')
    spansForErr.forEach(span => {
        span.textContent = '';
    });

    const formData = new FormData(loginForm);
    const formDataObject = {};

    formData.forEach((value, key) => (formDataObject[key] = value));

    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify(formDataObject),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        const responseData = await response.json();
    
        if (response.status === 201) {
            console.log('im here')
            sessionStorage.setItem('userData', JSON.stringify(responseData));
            location.assign('/home');
        } else if (response.status === 400) {
            handleLoginErrors(responseData);
        } else if (response.status === 401) {
            const spanToDisplayError = document.querySelector('.invalid-email-or-password');

            spanToDisplayError.textContent = responseData.message;
        }
    } catch(error) {
       console.log(error) 
    }

    
});

function handleLoginErrors(loginData) {
    for (const key in loginErrorDisplay) {
        const inputElement = loginErrorDisplay[key];

        if (loginData.message.startsWith(`"${key}"`)) {
            const spanToDisplayErr = inputElement.nextElementSibling;
            if (spanToDisplayErr) {
                spanToDisplayErr.textContent = loginData.message;
            }
        }
    }
}

