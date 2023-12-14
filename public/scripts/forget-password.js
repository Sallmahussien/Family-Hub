const emailInput = document.getElementById('email');
const spanToDisplayErr = emailInput.nextElementSibling;

async function submitForm() {
    spanToDisplayErr.textContent = '';

    try {
        const response = await fetch('/api/v1/password/forget-password', {
            method: 'POST',
            body: JSON.stringify({ email: emailInput.value }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (response.status === 201) {
            const formContainer = document.querySelector('.form-container');
            const msgContainer = document.querySelector('.send-email-container');

            formContainer.style.display = 'none';
            msgContainer.style.display = 'block';

        } else if (response.status === 400 || response.status === 409) {
            spanToDisplayErr.textContent = responseData.message;
        } else if (response.status === 409) {
            console.log(responseData)
        }
    } catch (error) {
        console.log(error);
    }

}

function redirectToLogin() {
    location.assign('/login');
}