document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");

    function toggleDropdown(event) {
        var dropdown = event.currentTarget.parentElement.querySelector('.dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    function closeDropdownIfOpen(event) {
        var dropdown = document.querySelector('.dropdown.active');
        if (dropdown && !event.target.closest('.dropdown')) {
            dropdown.classList.remove('active');
        }
    }

    if (toggleButton && sidebar) {
        toggleButton.addEventListener("click", function () {
            if (sidebar.classList.contains("d-none")) {
                sidebar.classList.remove("d-none");
                sidebar.classList.add("d-block");
            } else {
                sidebar.classList.remove("d-block");
                sidebar.classList.add("d-none");
            }
        });
    }
    window.toggleDropdown = toggleDropdown;
    document.body.addEventListener('mousedown', closeDropdownIfOpen);
});