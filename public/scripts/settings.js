document.getElementById('userEmail').textContent = userEmail;

document.getElementById('userFName').textContent = userFirstName;

document.getElementById('userMainPhoto').src = userProfile ? `/images/${userProfile}` : '/imgs/user.jpg';
document.getElementById('userPhoto').src = userProfile ? `/images/${userProfile}` : '/imgs/user.jpg';

async function getCircleInput() {

    const circleNameSettings = document.getElementById('circleNameInput');

    circleNameSettings.placeholder = await getCircleName();
}

async function getCircleName() {
    const response = await fetch(`/api/v1/circles/${circleId}`);
    const data = await response.json();
    const circleName = data.name;
    return circleName;
}

getCircleInput();

async function getCircleCoverPhoto() {
    try {
        const response = await fetch(`/api/v1/circles/${circleId}`);
        const data = await response.json();

        if (response.status === 200) {
            const circleCoverPhoto = data.coverPhoto ? `/images/${circleCoverPhoto}` : '/imgs/cover.png';
            document.getElementById('circleCoverPhoto').src = circleCoverPhoto;
        }

    } catch (error) {
        console.error(error)
    }
}

getCircleCoverPhoto();

document.addEventListener('DOMContentLoaded', function () {
    var privacyView = document.querySelector('.privacy_view');
    var infoView = document.querySelector('.info_view');
    var membersView = document.querySelector('.members_view');

    var privacyOption = document.querySelector('.privacy');
    var infoOption = document.querySelector('.info');
    var membersOption = document.querySelector('.members');

    privacyView.style.display = 'none';
    infoView.style.display = 'none';
    membersView.style.display = 'none';

    privacyOption.addEventListener('click', function () {
        showView(privacyView);
    });

    infoOption.addEventListener('click', function () {
        showView(infoView);
    });

    membersOption.addEventListener('click', function () {
        showView(membersView);
    });

    function showView(viewToShow) {
        privacyView.style.display = (viewToShow === privacyView) ? 'flex' : 'none';
        infoView.style.display = (viewToShow === infoView) ? 'flex' : 'none';
        membersView.style.display = (viewToShow === membersView) ? 'flex' : 'none';
    }

    // TO DO

    function openChangeEmailModal() {
        $('#changeEmailModal').modal('show');
    }

    function closeChangeEmailModal() {
        $('#changeEmailModal').modal('hide');
    }

    // change user email

    function changeUserEmail() {
        const newEmail = document.getElementById('newEmail').value;
        const errorSpan = document.getElementById('errorSpan');

        const url = `/api/v1/circles/${circleId}/users/${userId}`;
        const userUpdateData = {
            email: newEmail,
        };

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userUpdateData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('userEmail').textContent = newEmail;
                $('#changeEmailModal').modal('hide');
            })
            .catch(error => {
                console.error('Error changing email:', error);
                errorSpan.textContent = 'Error changing email. Please try again.';
            });
    }


    async function changeProfilePic() {
        const profilePhotoInput = document.getElementById('profilePhoto');
        const newProfilePhoto = profilePhotoInput.files[0];

        const formData = new FormData();
        formData.append('profilePhoto', newProfilePhoto);

        const url = `/api/v1/circles/${circleId}/users/${userId}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Success:', data);

                const profilePhotoElement = document.getElementById('userMainPhoto');
                profilePhotoElement.src = `../../images/${newProfilePhoto.name}` ? `../../images/${newProfilePhoto.name}` : `../../images/${userData.profilePhoto}`;


            } else {
                const errorSpan = document.querySelector('.profilePic_control span');
                errorSpan.textContent = 'Error changing profile photo. Please try again.';
            }
        } catch (error) {
            console.error('Error changing profile photo:', error);
            const errorSpan = document.querySelector('.profilePic_control span');
            errorSpan.textContent = 'Error changing profile photo. Please try again.';
        }
    }

    function changeUserPassword() {
        const currPassword = document.getElementById('password').value;
        const newPassword = document.getElementById('newPassword').value;
        const currPasswordError = document.getElementById('currPasswordError');
        const newPasswordError = document.getElementById('newPasswordError');

        const url = `/api/v1/password/change-password/${userId}`;

        const userUpdateData = {
            circleId: circleId,
            userId: userId,
            password: currPassword,
            newPassword: newPassword,
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userUpdateData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                console.log('Success:', data.message);
                currPasswordError.textContent = data.message;
                newPasswordError.textContent = data.message;
            })
            .catch(error => {
                console.error('Error changing password:', error);

                if (error.message.includes('404')) {
                    currPasswordError.textContent = "Incorrect password. Please try again.";
                    newPasswordError.textContent = '';
                } else {
                    currPasswordError.textContent = "Error changing password. Please try again.";
                    newPasswordError.textContent = '';
                }
            });

    }

    async function changeCircleInfo() {
        const newCircleName = document.getElementById('circleNameInput').value;
        const coverPhotoInput = document.getElementById('coverPhoto');
        const newCoverPhoto = coverPhotoInput.files[0];

        console.log('newCircleName', newCircleName);
        console.log('newCoverPhoto', newCoverPhoto);

        const formData = new FormData();

        formData.append('name', newCircleName ? newCircleName : await getCircleName());

        if (newCoverPhoto) {
            formData.append('coverPhoto', newCoverPhoto);
        }

        console.log('formData', formData);

        const url = `/api/v1/circles/${circleId}`;

        fetch(url, {
            method: 'PUT',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);

                if (newCircleName) {
                    document.getElementById('circleName').textContent = newCircleName;
                }

                if (newCoverPhoto) {
                    const coverPhotoElement = document.getElementById('circleCoverPhoto');
                    coverPhotoElement.src = URL.createObjectURL(newCoverPhoto);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                console.error('Error changing circle info:', error);
            });
    }

    // members view

    async function getCircleMembers() {
        try {
            const response = await fetch(`/api/v1/circles/${circleId}/users/`);
            const users = await response.json();

            console.log('users', users);
            const membersContainer = document.getElementById('membersContainer');

            users.forEach(user => {
                const memberDiv = document.createElement('div');
                memberDiv.id = `user-${user.id}`;
                memberDiv.className = 'member d-flex justify-content-between';
                memberDiv.innerHTML = `
                    <h3 class="fs-4">${user.firstName + " " + user.lastName}</h3>
                    <button type="button" class="btn btn-primary p-1 border-0" onclick="deleteUser('${user.id}')" >Remove</button>
                `;

                membersContainer.appendChild(memberDiv);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    getCircleMembers();

    async function sendInvitation() {
        const inviteEmail = document.getElementById('inviteEmail').value;

        const url = `/api/v1/users/${userId}/invite-member`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: inviteEmail,
                }),
            });

            if (response.status === 400) {
                const errorData = await response.json();
                console.error('Failed to send invitation. Server response:', errorData);
            }
            else if (response.status === 201) {
                const errorData = await response.json();
                console.error('201 - Server:', errorData);
            }
            else if (response.status === 200) {
                console.log('Invitation sent successfully');
            } else {

                // console.log(await response.status)
                console.error('Failed to send invitation');
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
        }
    }

    async function deleteUser(userId) {
        const confirmDeletion = confirm('Are you sure you want to remove this user?');

        if (!confirmDeletion) {
            return;
        }

        try {
            const url = `/api/v1/circles/${circleId}/users/${userId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const userElement = document.getElementById(`user-${userId}`);
                if (userElement) {
                    userElement.remove();
                } else {
                    console.error('User element not found in the DOM.');
                }
            } else {
                console.error('Failed to delete user. Status:', response.status);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    window.changeUserEmail = changeUserEmail;
    window.closeChangeEmailModal = closeChangeEmailModal;
    window.openChangeEmailModal = openChangeEmailModal;
    window.changeProfilePic = changeProfilePic;
    window.changeUserPassword = changeUserPassword;
    window.changeCircleInfo = changeCircleInfo;
    window.sendInvitation = sendInvitation;
    window.deleteUser = deleteUser;

});