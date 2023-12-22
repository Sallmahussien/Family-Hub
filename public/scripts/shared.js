const userDataFromSession = sessionStorage.getItem('userData');
const userData = JSON.parse(userDataFromSession);
const userId = userData.id;
const circleId = userData.circleId;
const userEmail = userData.email;
const userFirstName = userData.firstName;
const userProfile = userData.profilePhoto;


document.getElementById('userFName').textContent = userFirstName;

document.getElementById('userMainPhoto').src = `../../images/${userProfile}`;


async function getCircleName() {
    const response = await fetch(`/api/v1/circles/${circleId}`);
    const data = await response.json();

    const circleName = data.name;

    document.getElementById('circleName').textContent = circleName;
    return circleName;
}

getCircleName();


async function getCircleCover() {
    const response = await fetch(`/api/v1/circles/${circleId}`);
    const data = await response.json();
    const circleCover = data.coverPhoto;
    document.getElementById('circleCoverPic').src = `../../images/${circleCover}`? `../../images/${circleCover}` : `/imgs/cover.png`;
    return circleCover;
}

getCircleCover();