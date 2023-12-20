const userData = handleUserData();
const circleId = userData.circleId;
const userId = userData.id;
const userEmail = userData.email;
const userFirstName = userData.firstName;
const userProfile = userData.profilePhoto;
const role = userData.role;

getCircleName(circleId);

// http methods
async function getCircleName(circleId) {
    try {
        const response = await fetch(`/api/v1/circles/${circleId}`);
        const data = await response.json();

        if (response.status === 200) {
            hadleCircleData(data);
        }
    } catch (err) {
        console.error(err);
    }
}

// logic functions
function hadleCircleData(data) {
    const circleName = document.getElementById('circleName');
    const circleCoverPhoto = document.getElementById('circleCoverPic');

    circleName.textContent = data.name;
    circleCoverPhoto.src = data.coverPhoto ? `/images/${data.coverPhoto}` : `/imgs/cover.png`;
}

function handleUserData() {
    const userDataFromSession = sessionStorage.getItem('userData');
    const userData = JSON.parse(userDataFromSession);

    const userFirstName = userData.firstName;
    const userProfile = userData.profilePhoto;

    const userProfileContainer = document.getElementById('userMainPhoto');
    const userName = document.getElementById('userFName');

    userProfileContainer.src = userProfile ? `/images/${userProfile}` : `imgs/user.jpg`;

    userName.textContent = userFirstName;

    return userData;
}

// add event listener
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