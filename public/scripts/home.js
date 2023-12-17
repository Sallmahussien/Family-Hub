const getElement = (id) => document.getElementById(id);

const postForm = getElement('postForm');
const postBtn = getElement('sharebtn');
const formDataObject = {};



// user and circle Ids => session storage 
const userDataFromSession = sessionStorage.getItem('userData');
const userData = JSON.parse(userDataFromSession);
const userId = userData.id;
const circleId = userData.circleId;
const userFirstName = userData.firstName;
// console.log(userId);
// console.log(circleId);



async function getCircleName() {
    const response = await fetch(`/api/v1/circles/${circleId}`);
    const data = await response.json();
    // console.log(data);
    const circleName = data.name;
    // console.log(circleName);
    document.getElementById('circleName').textContent = circleName;
}

getCircleName();


document.addEventListener("DOMContentLoaded", function () {
    function openContactModal () {
        $('#contactModal').modal('show');
    }

    function openPhotoModal() {
        $('#photoModal').modal('show');
    }

    function openEventModal() {
        console.log('open event modal');
        $('#eventModal').modal('show');
    }

    function openListModal() {
        $('#listModal').modal('show');
    }

    function createPost() { 
        const content = document.getElementById('content').value;

        const url = `/api/v1/circles/${circleId}/users/${userId}/posts/`;
        const requestBody = {
            content: content
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Post created successfully:', data);


            const newPostDiv = document.createElement('div');
            newPostDiv.className = 'post mx-5 p-4 mt-4';

            newPostDiv.innerHTML = `
            <div class="feed_header d-flex justify-content-between">
            <div class="userImg d-flex ">
                <img src="/imgs/user.webp" alt="">
                <h3 class="mt-auto mb-auto ms-3 fs-4">${ userFirstName } has posted</h3>
            </div>

            <!-- component -->
            <div class="dropdown-container position-relative  d-inline-block ">
                <i class="fa-solid fa-ellipsis-vertical w-25" onclick="toggleDropdown(event)"></i>
                <ul class="dropdown ms-0 ps-0 list-unstyled position-absolute top-0 bg-light z-3">
                    <li class="edit mb-1 w-100 text-start p-2">Edit</li>
                    <li class="delete w-100 text-start p-2">Delete</li>
                </ul>
            </div>
            
        </div>
        <div class="post_content w-100 mx-5 my-4">
            <p> ${ content }</p>
        </div>

        <!-- component -->
        <div class="like_comment_component bg-body  d-flex row">
            <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto">
                <i class="fa-regular fa-thumbs-up pt-1"></i>
                <p class="mb-0 ms-2 fs-5">like</p>
            </div>
            <div class="comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto ">
                <i class="fa-solid fa-comment pt-1"></i>
                <p class="mb-0 ms-2 fs-5">comment</p>
            </div>
        </div>

        <!-- comment component -->
        <div class="comment-component d-flex w-100 mx-auto gap-4 mt-3">
            <form action=""  class="d-flex flex-grow-1 ">
                <input type="text" class="w-100 p-2">
            </form>
            <button type="button" class="btn btn-secondary bg-light  ms-auto"><i class="fa-solid fa-paper-plane font"></i></button>
        </div>
            `;

            const feedBodyDiv = document.getElementById('feedBody');
            feedBodyDiv.appendChild(newPostDiv);

            document.getElementById('content').value = '';
        })
        .catch(error => {
            console.error('Error creating post:', error);
        });
    }

    function uploadPhoto() {
        const fileInput = document.getElementById('photoInput');
        const file = fileInput.files[0];
        const caption = document.getElementById('caption').value;
    
        if (!file) {
            console.error('You need to choose a file!');
            return;
        }
    
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('caption', caption);

    
        const url = `/api/v1/circles/${circleId}/users/${userId}/photos/`;
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
            },
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Photo uploaded successfully:', data);
    
            const uploadedPhoto = data.photo;
            const photoCaption = data.caption;
            // console.log('photo URL:', uploadedPhoto);
    
            const newPhotoDiv = document.createElement('div');
            newPhotoDiv.className = 'photo mx-5 p-4 mt-4';
    
            newPhotoDiv.innerHTML = `
            
            <div class="feed_header d-flex justify-content-between">
                <div class="userImg d-flex">
                    <img src="/imgs/user.webp" alt="">
                    <h3 class="mt-auto mb-auto ms-3 fs-4">${ userFirstName } has posted</h3>
                </div>

                <!-- component -->
                <div class="dropdown-container position-relative  d-inline-block ">
                    <i class="fa-solid fa-ellipsis-vertical w-25" onclick="toggleDropdown(event)"></i>
                    <ul class="dropdown ms-0 ps-0 list-unstyled position-absolute top-0 bg-light z-3">
                        <li class="edit mb-1 w-100 text-start p-2">Edit</li>
                        <li class="delete w-100 text-start p-2">Delete</li>
                    </ul>
                </div>
            </div>
            <div class="feed_content">
                <p class="p-3 pb-1 ms-5 fs-5" >${photoCaption? photoCaption: ""}</p>
                <img src="../../images/${uploadedPhoto}" alt="" class="w-100 mx-3 my-3 ">
            </div>

            <!-- component -->
            <div class="like_comment_component bg-body  d-flex row">
                <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto">
                    <i class="fa-regular fa-thumbs-up pt-1"></i>
                    <p class="mb-0 ms-2 fs-5">like</p>
                </div>
                <div class="comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto ">
                    <i class="fa-solid fa-comment pt-1"></i>
                    <p class="mb-0 ms-2 fs-5">comment</p>
                </div>
            </div>
            <!-- comment component -->
            <div class="comment-component d-flex w-100 mx-auto gap-4 mt-3">
                <form action=""  class="d-flex flex-grow-1 ">
                    <input type="text" class="w-100 p-2">
                </form>
                <button type="button" class="btn btn-secondary bg-light  ms-auto"><i class="fa-solid fa-paper-plane font"></i></button>
            </div>
            `;
    
            const feedBodyDiv = document.getElementById('feedBody');
            feedBodyDiv.appendChild(newPhotoDiv);
    
            $('#photoModal').modal('hide');
        })
        .catch(error => {
            console.error('Error uploading photo:', error);
        });
    }
        

    function createEvents() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const eventTitle = document.getElementById('eventTitle').value;
        const eventDescription = document.getElementById('eventDescription').value;
    
        const isoStartDate = new Date(startDate).toISOString();
        const isoEndDate = new Date(endDate).toISOString();

        const requestBody = {
            startDate: isoStartDate,
            endDate: isoEndDate ? isoEndDate : isoStartDate,
            title: eventTitle,
            description: eventDescription
        };
        // console.log(JSON.stringify(requestBody));
    
        const url = `/api/v1/circles/${circleId}/users/${userId}/events/`;
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Event created successfully:', data);
    
            const newEventDiv = document.createElement('div');
            newEventDiv.className = 'event mx-5 p-4 mt-4';

            newEventDiv.innerHTML = `
            <div class="feed_header d-flex justify-content-between">
                                            <div class="userImg d-flex">
                                                <img src="/imgs/user.webp" alt="">
                                                <h3 class="mt-auto mb-auto ms-3 fs-4">${ userFirstName } has posted</h3>
                                            </div>

                                            <!-- component -->
                                            <div class="dropdown-container position-relative  d-inline-block ">
                                                <i class="fa-solid fa-ellipsis-vertical w-25" onclick="toggleDropdown(event)"></i>
                                                <ul class="dropdown ms-0 ps-0 list-unstyled position-absolute top-0 bg-light z-3">
                                                    <li class="edit mb-1 w-100 text-start p-2">Edit</li>
                                                    <li class="delete w-100 text-start p-2">Delete</li>
                                                </ul>
                                            </div>
                                        </div>



                                        <div class="feed_content">
                                            <div class="event_component d-flex mx-5 my-4 h-100">
                                                <div class="date d-flex justify-content-center align-items-center fs-3 bg-body-secondary">
                                                    ${ startDate }
                                                </div>
                                                <div class="description d-flex flex-column justify-content-around ms-4">
                                                    <div class="event_title fs-4">
                                                        <h2>${ eventTitle }</h2>
                                                    </div>
                                                    <div class="event_description ps-4 fs-5 ">
                                                        <h4>${ eventDescription }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- component -->
                                        <div class="like_comment_component bg-body  d-flex row">
                                            <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto">
                                                <i class="fa-regular fa-thumbs-up pt-1"></i>
                                                <p class="mb-0 ms-2 fs-5">like</p>
                                            </div>
                                            <div class="comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto ">
                                                <i class="fa-solid fa-comment pt-1"></i>
                                                <p class="mb-0 ms-2 fs-5">comment</p>
                                            </div>
                                        </div>
                                        <!-- comment component -->
                                        <div class="comment-component d-flex w-100 mx-auto gap-4 mt-3">
                                            <form action=""  class="d-flex flex-grow-1 ">
                                                <input type="text" class="w-100 p-2">
                                            </form>
                                            <button type="button" class="btn btn-secondary bg-light  ms-auto"><i class="fa-solid fa-paper-plane font"></i></button>
                                        </div>
        `;

            const feedBodyDiv = document.getElementById('feedBody');
            feedBodyDiv.appendChild(newEventDiv);

            $('#eventModal').modal('hide');
        })
        .catch(error => {
            console.error('Error creating event:', error);
        });
    }

    function createList() {
        const listName = document.getElementById('listName').value;
        const listItems = document.getElementById('listItems').value;
    
        const requestBody = {
            name: listName,
            items: listItems.split(',').map(item => item.trim())
        };
    
        const url = `/api/v1/circles/${circleId}/users/${userId}/lists/`;
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(data => {
            console.log('List created successfully:', data);
    
            const newListDiv = document.createElement('div');
            newListDiv.className = 'lists mx-5 p-4 mt-4';
    
            newListDiv.innerHTML = `
                <!-- component -->
                <div class="feed_header d-flex justify-content-between">
                    <div class="userImg d-flex">
                        <img src="/imgs/user.webp" alt="">
                        <h3 class="mt-auto mb-auto ms-3 fs-4">${ userFirstName } has posted</h3>
                    </div>
    
                    <!-- component -->
                    <div class="dropdown-container position-relative d-inline-block">
                        <i class="fa-solid fa-ellipsis-vertical w-25" onclick="toggleDropdown(event)"></i>
                        <ul class="dropdown ms-0 ps-0 list-unstyled position-absolute top-0 bg-light z-3">
                            <li class="edit mb-1 w-100 text-start p-2">Edit</li>
                            <li class="delete w-100 text-start p-2">Delete</li>
                        </ul>
                    </div>
                </div>
    
                <div class="feed_content">
                    <h3 class="mx-5 my-3 fs-4"> Added to ${ list.name } these new items </h3>
                    <form action="" class="mx-5 my-3 d-flex">
                        ${ requestBody.items.map(item => `
                            <label class="check-list">
                                <input checked="checked" type="checkbox">
                                <div class="checkmark"></div>
                                ${ item }
                            </label>
                        `).join('')}
                    </form>
                </div>
    
                <!-- component -->
                <div class="like_comment_component bg-body d-flex row">
                    <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto">
                        <i class="fa-regular fa-thumbs-up pt-1"></i>
                        <p class="mb-0 ms-2 fs-5">like</p>
                    </div>
                    <div class="comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto ">
                        <i class="fa-solid fa-comment pt-1"></i>
                        <p class="mb-0 ms-2 fs-5">comment</p>
                    </div>
                </div>
    
                <!-- comment component -->
                <div class="comment-component d-flex w-100 mx-auto gap-4 mt-3">
                    <form action="" class="d-flex flex-grow-1 ">
                        <input type="text" class="w-100 p-2">
                    </form>
                    <button type="button" class="btn btn-secondary bg-light ms-auto"><i class="fa-solid fa-paper-plane font"></i></button>
                </div>
            `;
    
            const feedBodyDiv = document.getElementById('feedBody');
            feedBodyDiv.appendChild(newListDiv);
    
            $('#listModal').modal('hide');
        })
        .catch(error => {
            console.error('Error creating list:', error);
        });
    }

    function addContact() {
        // our logic
        $('#contactModal').modal('hide');
    }

    $(document).ready(function () {
        $('#photoModal .close, #photoModal button[data-dismiss="modal"]').click(function () {
            $('#photoModal').modal('hide');
        });

        $('#eventModal .close, #eventModal button[data-dismiss="modal"]').click(function () {
            $('#eventModal').modal('hide');
        });

        $('#listModal .close, #listModal button[data-dismiss="modal"]').click(function () {
            $('#listModal').modal('hide');
        });

        $('#contactModal .close, #contactModal button[data-dismiss="modal"]').click(function () {
            $('#contactModal').modal('hide');
        });
    });

    window.openContactModal = openContactModal;
    window.openPhotoModal = openPhotoModal;
    window.openEventModal = openEventModal;
    window.openListModal = openListModal;
    window.createPost = createPost;
    window.uploadPhoto = uploadPhoto;
    window.createEvents = createEvents;
    window.createList = createList;
    window.addContact = addContact;
});

