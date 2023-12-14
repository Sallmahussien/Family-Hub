const passwordInput = document.getElementById('password');
const spanToDisplayErr = passwordInput.nextElementSibling;

const path = window.location.pathname;
const match = path.match(/\/api\/v1\/password\/reset-password\/([^\/]+)\/([^\/]+)/);
const userId = match ? match[1] : null;
const token = match ? match[2] : null;

async function resetPassword () {
    spanToDisplayErr.textContent = '';

    try {
        const response = await fetch(`/api/v1/password/reset-password/${userId}/${token}`, {
            method: 'POST',
            body: JSON.stringify({ password: passwordInput.value }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (response.status === 201) {
            const formContainer = document.querySelector('.reset-password-container');
            const msgContainer = document.querySelector('.message-container');

            formContainer.style.display = 'none';
            msgContainer.style.display = 'block';

        } else if (response.status === 400) {
            spanToDisplayErr.textContent = responseData.message;
        } 
    } catch (error) {
        console.log(error)
    }
}

function redirectToLogin () {
    location.assign('/login');
}
