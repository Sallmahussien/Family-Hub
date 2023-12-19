const getElement = (id) => document.getElementById(id);

const calendarEl = getElement('calendar');
const modalContainer = getElement('modalContainer');
const addEventBtn = getElement('addEventBtn');
const submitBtn = getElement('modalSubmit');

const form = document.querySelector('form');

const createEventErrDisplay = {
    title: getElement('title'),
    startDate: getElement('startDate'),
    endDate: getElement('endDate'),
    reminder: getElement('reminder'),
}

fetchAndSetEvents();

// http methods
async function getAllEvents(url) {
    try {
        const response = await fetch(url);
        const responseData = await response.json();

        if (response.status === 200) {
            const events = createEvents(responseData);
            return events;
        }
    } catch (error) {
        console.error(error);
    }
}

async function createEvent(url, body) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const responseData = await response.json();

        if (response.status === 201) {
            location.reload();
        } else if (response.status === 400) {
            handleDisplayingErr(responseData);
        }
    } catch (error) {
        console.error(error);
    }
}

function createEvents(responseData) {
    console.log(responseData);
    const events = [];
    responseData.forEach(feed => {
        const event = feed.event;

        events.push({
            title: event.title,
            start: event.startDate,
            end: event.endDate,
        });
    });

    return events;
}

async function fetchAndSetEvents() {
    try {
        const events = await getAllEvents(`/api/v1/circles/${circleId}/events`);
        calendar.setOption('events', events);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

function handleDisplayingErr(responseData) {
    for (const key in createEventErrDisplay) {
        const inputElement = createEventErrDisplay[key];

        if (responseData.message.startsWith(`"${key}"`)) {
            const spanToDisplayErr = inputElement.nextElementSibling;
            if (spanToDisplayErr) {
                spanToDisplayErr.textContent = responseData.message;
            }
        }
    }
}

const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    events: []
});
calendar.render();

addEventBtn.addEventListener('click', () => {
    modalContainer.style.display = 'flex';
});

submitBtn.addEventListener('click', async () => {
    const spans = document.querySelectorAll('form span');
    spans.forEach(span => {
        span.textContent = '';
    });

    const formData = new FormData(form);

    if (formData.get('reminder') === '') formData.delete('reminder');

    const reqBody = {};

    formData.forEach(function (value, key) {
        reqBody[key] = value;
    });

    await createEvent(`/api/v1/circles/${circleId}/users/${userId}/events`, JSON.stringify(reqBody));
});

function closeModal() {
    modalContainer.style.display = 'none';
}

