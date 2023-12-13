document.addEventListener("DOMContentLoaded", function () {
    function openForm() {
        var modal = document.getElementById('AddContact');
        modal.style.visibility = 'visible';
    }

    function closeForm() {
        var modal = document.getElementById('AddContact');
        modal.style.visibility = 'hidden';
    }

    window.openForm = openForm;
    window.closeForm = closeForm;

    document.addEventListener('click', function (event) {
        var contactSelector = event.target.closest('.contact-selector');
        if (contactSelector) {
            var rightSection = document.querySelector('.right');
            rightSection.style.display = (rightSection.style.display === 'flex') ? 'none' : 'flex';
        }
    });
});