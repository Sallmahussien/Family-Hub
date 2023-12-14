const getElement = (id) => document.getElementById(id);
const form = getElement('myForm');
const submitBtn = getElement('submitBtn');
const cancelBtn = getElement('cancelBtn');

const createCircleErrorDisplay = {
    name: getElement('name'),
    coverPhoto: getElement('cover-photo')
}

const formDataObject = {};

submitBtn.addEventListener('click', handleSubmit);

async function handleSubmit() {
    const formData = new FormData(form);

    try {
        const createCircleResponse = await createCircle(formData);

        if (createCircleResponse.status === 201) {
            const circleData = await createCircleResponse.json();
            const storedData = updateStoredData(circleData);

            try {
                await signup(storedData);
            } catch (error) {
                console.log(error);
            }
        } else if (createCircleResponse.status === 400) {
            handleCircleErrors(await createCircleResponse.json());
        }
    } catch (error) {
        console.log(error);
    }
}

async function createCircle(formData) {
    return await fetch('/api/v1/circles/', {
        method: 'POST',
        body: formData,
    });
}

function updateStoredData(circleData) {
    const storedDataString = sessionStorage.getItem('formData');
    const storedData = JSON.parse(storedDataString) || {};
    storedData.circleId = circleData.id;
    return storedData;
}

async function signup(storedData) {
    const signupResponse = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify(storedData),
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (signupResponse.status === 201) {
        const responseData = await signupResponse.json();
        sessionStorage.setItem('createdUser', JSON.stringify(responseData));
        location.assign('/home');
    } else if (signupResponse.status === 400) {
        console.log(await signupResponse.json());
    } else if (signupResponse.status === 409) {
        console.log('go login');
    }
}

function handleCircleErrors(createCircleData) {
    for (const key in createCircleErrorDisplay) {
        const inputElement = createCircleErrorDisplay[key];

        if (createCircleData.message.startsWith(`"${key}"`)) {
            const spanToDisplayErr = inputElement.nextElementSibling;
            if (spanToDisplayErr) {
                spanToDisplayErr.textContent = createCircleData.message;
            }
        }
    }
}

cancelBtn.addEventListener('click', () => {
    console.log('clicked cancel')
    location.assign('/');
});