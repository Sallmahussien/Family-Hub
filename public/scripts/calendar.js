document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: [
            {
                title: 'Event 1',
                start: '2023-12-06',
            },
            {
                title: 'Event 2',
                start: '2023-01-05',
                end: '2023-01-07',
            },]
    });
    calendar.render();
});