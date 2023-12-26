
const getElement = (id) => document.getElementById(id);

const postForm = getElement('postForm');
const postBtn = getElement('sharebtn');
const formDataObject = {};

// user and circle Ids => session storage 
document.addEventListener("DOMContentLoaded", function () {

document.getElementById('userPostingPhoto').src = userProfile? `/images/${userProfile}` : `/imgs/user.jpg`;

async function getCircleName() {
    const response = await fetch(`/api/v1/circles/${circleId}`);
    const data = await response.json();
    const circleName = data.name;
    document.getElementById('circleName').textContent = circleName;
}

async function getCircleCover() {
    const response = await fetch(`/api/v1/circles/${circleId}`);
    const data = await response.json();
    const circleCover = data.coverPhoto? data.coverPhoto : 'cover.png';
    document.getElementById('circleCoverPic').src = `../../images/${circleCover}`? `../../images/${circleCover}` : `/imgs/cover.png`;
    return circleCover;
}

function getCommentsByFeedId(feed, type) {
    const url = `/api/v1/circles/${circleId}/feeds/${feed}/comments/`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to get comments');
        }
    })
    .then(comments => {
        // console.log('Comments retrieved successfully:', comments);

        comments.forEach(comment => {
            if (comment.feedId === feed) {
                    const commentInput = document.querySelector(`.commentInput[data-feed-id="${feed}"]`);    
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comments d-flex flex-column';
                    commentDiv.innerHTML = `
                        <div class="comment_content d-flex flex-column w-100" id="comment" data-comment-id='${comment.id}' data-feed-id='${comment.feedId}'>
                        <div class="d-flex mt-3 justify-content-between ms-2 mb-1">
                            <div class="d-flex comment-header mt-3 ms-2 mb-1">
                                <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:45px !important; height:45px !important; border-radius:50% !important" >
                                <h5 class="ms-2">${ userFirstName } :</h5>
                                <h6 class="ms-0 px-2 mt-0 pt-0" >${ comment.content }</h6>
                            </div>
                            <div class="dropdown-container position-relative d-inline-block">
                                <i class="fa-solid fa-ellipsis-vertical w-25" onclick="toggleDropdown(event)"></i>
                                <ul class="dropdown ms-0 ps-0 list-unstyled position-absolute top-0 bg-light z-3">
                                    <li class="edit mb-1 w-100 text-start p-2" onclick="openEditComment()">Edit</li>
                                    <li class="delete w-100 text-start p-2" onclick="openConfirmDeleteComment()">Delete</li>
                                </ul>
                            </div>
                    `;
    
                    const postContainer = commentInput.closest('[data-post-container]');
                    if (postContainer) {
                        postContainer.appendChild(commentDiv);
                    } else {
                        console.error('Post container not found for feedId:', feed);
                    }
                } else {
                // console.log('No comments found for feedId:', feed);
        }
    });
    })
    .catch(error => {
        console.error('Error getting comments:', error.message);
    });

};

function formatDate(inputDate, options = {}) {
    const date = new Date(inputDate);

    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const defaultOptions = {
        day: true,
        month: true,
        year: false,
        monthFormat: 'long',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const day = mergedOptions.day ? date.getDate() : '';
    const monthIndex = date.getMonth();
    const year = mergedOptions.year ? date.getFullYear() : '';

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const monthName = mergedOptions.month
        ? (mergedOptions.monthFormat === 'short' ? monthNames[monthIndex].substring(0, 3) : monthNames[monthIndex])
        : '';

    return { day, month: monthName, year };
}

const listsFeedHeader = `
                    <div class="feed_header d-flex justify-content-between" id="list">
                        <div class="userImg d-flex">
                            <img src="/imgs/user.webp" alt="" class='userFeedImage'>
                            <h3 class="mt-auto mb-auto ms-3 fs-4"> <span class="fw-bold" > ${ userFirstName } </span> has Added these new items to do</h3>
                        </div>

                        <!-- component -->
                        <div class="dropdown-container position-relative d-inline-block">
                            <i class="fa-solid fa-ellipsis-vertical w-25" onclick="toggleDropdown(event)"></i>
                            <ul class="dropdown ms-0 ps-0 list-unstyled position-absolute top-0 bg-light z-3">
                                <li class="edit mb-1 w-100 text-start p-2" onclick="openEditList()">Edit</li>
                                <li class="delete w-100 text-start p-2" onclick="openConfirmDeleteList()">Delete</li>
                            </ul>
                        </div>
                    </div>
`

const PostsFeedHeader = `
                <div class="feed_header d-flex justify-content-between" id="post">
                    <div class="userImg d-flex ">
                        <img src="/imgs/user.webp" alt="" class='userFeedImage'>
                        <h3 class="mt-auto mb-auto ms-3 fs-4"> <span class="fw-bold" > ${ userFirstName } </span> has posted</h3>
                    </div>

                    <!-- component -->
                    <div class="dropdown-container position-relative d-inline-block">
                        <i class="fa-solid fa-ellipsis-vertical w-25" onclick="toggleDropdown(event)"></i>
                        <ul class="dropdown ms-0 ps-0 list-unstyled position-absolute top-0 bg-light z-3">
                            <li class="edit mb-1 w-100 text-start p-2" onclick="openEditPost()" >Edit</li>
                            <li class="delete w-100 text-start p-2" onclick="openConfirmDeletePost()">Delete</li>
                        </ul>
                    </div>
                </div>
                `

const PhotosFeedHeader = `
                <div class="feed_header d-flex justify-content-between" id="photo">
                    <div class="userImg d-flex">
                        <img src="/imgs/user.webp" alt="" class='userFeedImage'>
                        <h3 class="mt-auto mb-auto ms-3 fs-4"> <span class="fw-bold" > ${ userFirstName } </span> has posted a new photo</h3>
                    </div>

                    <!-- component -->
                    <div class="dropdown-container position-relative d-inline-block">
                        <i class="fa-solid fa-ellipsis-vertical w-25" onclick="toggleDropdown(event)"></i>
                        <ul class="dropdown ms-0 ps-0 list-unstyled position-absolute top-0 bg-light z-3">
                            <li class="edit mb-1 w-100 text-start p-2" onclick="openEditPhoto()">Edit</li>
                            <li class="delete w-100 text-start p-2" onclick="openConfirmDeletePhoto()" >Delete</li>
                        </ul>
                    </div>
                </div>
`

const EventsFeedHeader = `
            <div class="feed_header d-flex justify-content-between" id="event">
                <div class="userImg d-flex">
                    <img src="/imgs/user.webp" alt="" class='userFeedImage'>
                    <h3 class="mt-auto mb-auto ms-3 fs-4"> <span class="fw-bold" > ${ userFirstName } </span> has posted a new event</h3>
                </div>

                <!-- component -->
                <div class="dropdown-container position-relative d-inline-block">
                    <i class="fa-solid fa-ellipsis-vertical w-25" onclick="toggleDropdown(event)"></i>
                    <ul class="dropdown ms-0 ps-0 list-unstyled position-absolute top-0 bg-light z-3">
                        <li class="edit mb-1 w-100 text-start p-2" onclick="openEditEvent()">Edit</li>
                        <li class="delete w-100 text-start p-2" onclick="openConfirmDeleteEvent()">Delete</li>
                    </ul>
                </div>
            </div>
`

function getListItemsByListId(selectedListFeedId, listId) { 

    const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${selectedListFeedId}/lists/${listId}/listItems`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 409) {
                console.log('List items already exist.');
            } else {
                throw new Error('Failed to get list items');
            }
        })
        .then(listItems => {
            // console.log('List items retrieved successfully:', listItems);

            listItems.forEach(listItem => {
                if (listItem.deleted === false) {
            const listItemId = listItem.id;       

            const newListDiv = document.createElement('div');
            newListDiv.className = 'lists mx-5 p-4 mt-4';

            newListDiv.setAttribute('data-post-container', '')

                newListDiv.innerHTML = `
                    <!-- component -->    
                    ${ listsFeedHeader }

                    <div class="feed_content">
                        <form action="" class="mx-5 my-3 d-flex">
                                <label class="check-list">
                                    <input type="checkbox"  id="listItemInput">
                                    <div class="checkmark" id="listItem" onclick="doneListItem(this)" data-feed-id='${ selectedListFeedId }' data-list-id='${listId}' data-listItem-id='${ listItemId }'></div>
                                    ${ listItem.name }
                                </label>
                        </form>
                    </div>

                    <!-- component -->
                    <div class="like_comments bg-body d-flex flex-column">
                        <span class="mx-3 fs-5 LikeNums"></span>
                        <div class="like_comment_component bg-body  d-flex row">
                            <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" onclick="toggleLike('${selectedListFeedId}')">
                                <i class="fa-regular fa-thumbs-up pt-1 likeCreated" data-feed-id='${selectedListFeedId}'></i>
                                <p class="mb-0 ms-2 fs-5 likeCreated">like</p>
                            </div>
                            <div class="commentSection comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" >
                                <i class="fa-solid fa-comment pt-1"></i>
                                <p class="mb-0 ms-2 fs-5">comment</p>
                            </div>
                        </div>
                    </div>

                    <!-- comment component -->
                    <div class="commentComponent comment-component d-flex w-100 mx-auto gap-4 mt-3">
                        <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:40px !important; height:40px !important; border-radius:50%">
                        <form action="" class="d-flex flex-grow-1">
                            <input type="text" class="w-100 p-2 commentInput" data-feed-id='${selectedListFeedId}'>
                        </form>
                        <button type="button" class="btn btn-secondary bg-light ms-auto" onclick="createComments('${selectedListFeedId}')">
                            <i class="fa-solid fa-paper-plane font"></i>
                        </button>
                    </div>

                `;

                const feedBodyDiv = document.getElementById('feedBody');
                feedBodyDiv.appendChild(newListDiv);
                Array.from(document.getElementsByClassName('userFeedImage')).forEach(element => {          
                    element.src = `../../images/${userProfile}` ? `../../images/${userProfile}` : '/imgs/user.webp';
                });

                getCommentsByFeedId(selectedListFeedId);
                
                document.getElementById('listItem').setAttribute('data-list-id', listId);
                document.getElementById('listItem').setAttribute('data-feed-id', selectedListFeedId);
            }
        })
        })
        .catch(error => {
            console.error('Error getting list items:', error.message);
        });
    }


async function getCircle() {
    const response = await fetch(`/api/v1/circles/${circleId}/feeds`);
    const data = await response.json();
    
    data.forEach(feed => {
        if (feed.type === 'POST' && feed.deleted === false) {

            const content = feed.post.content;
            const postId = feed.post.id;
            let feedId = feed.id;
            const newPostDiv = document.createElement('div');
            newPostDiv.className = 'post mx-5 p-4 mt-4';
            newPostDiv.setAttribute('data-post-container', '')

            newPostDiv.innerHTML = `
                ${ PostsFeedHeader }
                <div class="post_content w-100 mx-5 my-4">
                    <p class=" fs-5 ms-3" id="postContent"> ${ content  }</p>
                </div>

                <!-- component -->
                <div class="like_comments bg-body d-flex flex-column">
                <span class="mx-3 fs-5 LikeNums"></span>
                <div class="like_comment_component bg-body  d-flex row">
                    <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" onclick="toggleLike('${feedId}')">
                        <i class="fa-regular fa-thumbs-up pt-1 likeCreated" data-feed-id='${feedId}'></i>
                        <p class="mb-0 ms-2 fs-5 likeCreated">like</p>
                    </div>
                    <div class="commentSection comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" >
                        <i class="fa-solid fa-comment pt-1"></i>
                        <p class="mb-0 ms-2 fs-5">comment</p>
                    </div>
                </div>
                </div>

                <!-- comment component -->
                <div class="commentComponent comment-component d-flex w-100 mx-auto gap-4 mt-3">
                    <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:40px !important; height:40px !important; border-radius:50%">
                    <form action="" class="d-flex flex-grow-1">
                        <input type="text" class="w-100 p-2 commentInput" data-feed-id='${feedId}'>
                    </form>
                    <button type="button" class="btn btn-secondary bg-light ms-auto" onclick="createComments('${feedId}')">
                        <i class="fa-solid fa-paper-plane font"></i>
                    </button>
                </div>
                `;
            getCommentsByFeedId(feed.id);
            const feedBodyDiv = document.getElementById('feedBody');
            feedBodyDiv.appendChild(newPostDiv);
          
            Array.from(document.getElementsByClassName('userFeedImage')).forEach(element => {          
                element.src = `../../images/${userProfile}` ? `../../images/${userProfile}` : '/imgs/user.webp';
            });

            document.getElementById('post').setAttribute('data-post-id', postId);
            document.getElementById('post').setAttribute('data-feed-id', feedId);

        }

        if (feed.type === 'PHOTO' && feed.deleted === false) {
            let photoCaption;

            if (feed.photo.caption) {
            photoCaption = feed.photo.caption === 'sharing this photo with you !' ? '' : feed.photo.caption;

            }
            const uploadedPhoto = feed.photo.photo;
            let photoId = feed.photo.id;
            let feedId = feed.id;

         
            const newPhotoDiv = document.createElement('div');
            newPhotoDiv.className = 'photo mx-5 p-4 mt-4';
            newPhotoDiv.setAttribute('data-post-container', '')
    
            newPhotoDiv.innerHTML = `
                ${ PhotosFeedHeader }
                <div class="feed_content">
                    <p class="pt-3 pb-0 mb-0 ms-5 fs-5" id="photoCaption">${photoCaption}</p>
                    <img src="../../images/${uploadedPhoto}" alt="" class="w-100 mx-3 my-1">
                </div>

                <!-- component -->
                <div class="like_comments bg-body d-flex flex-column">
                    <span class="mx-1 fs-5 LikeNums"></span>
                    <div class="like_comment_component bg-body  d-flex row">
                        <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" onclick="toggleLike('${feedId}')">
                            <i class="fa-regular fa-thumbs-up pt-1 likeCreated" data-feed-id='${feedId}'></i>
                            <p class="mb-0 ms-2 fs-5 likeCreated">like</p>
                        </div>
                        <div class="commentSection comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" >
                            <i class="fa-solid fa-comment pt-1"></i>
                            <p class="mb-0 ms-2 fs-5">comment</p>
                        </div>
                    </div>
                </div>

                <!-- comment component -->
                <div class="commentComponent comment-component d-flex w-100 mx-auto gap-4 mt-3">
                    <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:40px !important; height:40px !important; border-radius:50%">
                    <form action="" class="d-flex flex-grow-1">
                        <input type="text" class="w-100 p-2 commentInput" data-feed-id='${feedId}'>
                    </form>
                    <button type="button" class="btn btn-secondary bg-light ms-auto" onclick="createComments('${feedId}')">
                        <i class="fa-solid fa-paper-plane font"></i>
                    </button>
                </div>
                `;
            getCommentsByFeedId(feed.id);
            const feedBodyDiv = document.getElementById('feedBody');
            feedBodyDiv.appendChild(newPhotoDiv);

            Array.from(document.getElementsByClassName('userFeedImage')).forEach(element => {          
                element.src = `../../images/${userProfile}` ? `../../images/${userProfile}` : '/imgs/user.webp';
            });


            document.getElementById('photo').setAttribute('data-photo-id', photoId);
            document.getElementById('photo').setAttribute('data-feed-id', feedId);

        }

        if (feed.type === 'EVENT' && feed.deleted === false) {

            const startDate = feed.event.startDate;
            const endDate = feed.event.endDate;
            const eventTitle = feed.event.title;
            const eventDescription = feed.event.description;
            const eventId = feed.event.id;
            let feedId = feed.id;
            
    
            const { day, month } = formatDate(startDate, { monthFormat: 'long' });

            const newEventDiv = document.createElement('div');
            newEventDiv.className = 'event mx-5 p-4 mt-4';
            newEventDiv.setAttribute('data-post-container', '')

            newEventDiv.innerHTML = `
                    ${ EventsFeedHeader }

                    <div class="feed_content w-100" style="height: 150px">
                        <div class="event_component d-flex mx-1 my-4 w-100 h-100 border-1" >
                            <div class="date d-flex flex-column border-end-1 justify-content-center p-2 align-items-center fs-3 bg-body-secondary w-25 h-100">
                                <h4 id="startDateMonth"> ${ month } </h4>
                                <h1 id="startDateDay" > ${ day } </h1>
                            </div>
                            <div class="description d-flex flex-column justify-content-around ps-4 bg-info w-75 h-100">
                                <div class="event_title fs-4">
                                    <h2 class="fw-bold ps-1 text-light pb-2" style="border-bottom: 2px solid white" id="eventTitle" >${ eventTitle }</h2>
                                </div>
                                <div class="event_description ps-3 fs-5 mt-0">
                                    <h5 class="ms-3 text-light" id="eventDescription">${ eventDescription }</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- component -->
                    <div class="like_comments bg-body d-flex flex-column">
                        <span class="mx-1 fs-5 LikeNums"></span>
                        <div class="like_comment_component bg-body  d-flex row">
                            <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" onclick="toggleLike('${feedId}')">
                                <i class="fa-regular fa-thumbs-up pt-1 likeCreated" data-feed-id='${feedId}'></i>
                                <p class="mb-0 ms-2 fs-5 likeCreated">like</p>
                            </div>
                            <div class="commentSection comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" >
                                <i class="fa-solid fa-comment pt-1"></i>
                                <p class="mb-0 ms-2 fs-5">comment</p>
                            </div>
                        </div>
                    </div>

                    <!-- comment component -->
                    <div class="commentComponent comment-component d-flex w-100 mx-auto gap-4 mt-3">
                    <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:40px !important; height:40px !important; border-radius:50%">
                    <form action="" class="d-flex flex-grow-1">
                        <input type="text" class="w-100 p-2 commentInput" data-feed-id='${feedId}'>
                    </form>
                    <button type="button" class="btn btn-secondary bg-light ms-auto" onclick="createComments('${feedId}')">
                        <i class="fa-solid fa-paper-plane font"></i>
                    </button>
                </div>
            `;

            getCommentsByFeedId(feed.id);
            const feedBodyDiv = document.getElementById('feedBody');
            feedBodyDiv.appendChild(newEventDiv);
            Array.from(document.getElementsByClassName('userFeedImage')).forEach(element => {          
                element.src = `../../images/${userProfile}` ? `../../images/${userProfile}` : '/imgs/user.webp';
            });

            document.getElementById('event').setAttribute('data-event-id', eventId);
            document.getElementById('event').setAttribute('data-feed-id', feedId);
            
        }

        if (feed.type === 'LIST') {
            getListItemsByListId(feed.id, feed.list.id)
        }

        if (feed.likes && feed.likes.length > 0 && feed.likes.some(like => like.deleted === false)) {
            const likes = feed.likes;
            Array.from(document.getElementsByClassName('LikeNums')).forEach(element => {
                if (likes.length === 1) {
                    element.textContent = `	♥ ${likes.length} Like`;
                } else {
                element.textContent = `♥ ${likes.length} Likes`;
                }
            });
        } 


        if (feed.likes && feed.likes.some(like => like.userId === userId) 
            && feed.likes.some(like => like.deleted === false) && feed.likes.length > 0) {
                    Array.from(document.getElementsByClassName('likeCreated')).forEach(element => {
                        element.style.color = '#66b0ff';
                    });
        }

    });
}

getCircle();

// ======================
// ======================
    function openContactModal () {
        $('#contactModal').modal('show');
    }

    function openPhotoModal() {
        $('#photoModal').modal('show');
    }

    function openEventModal() {
        $('#eventModal').modal('show');
    }

    function openListModal() {
        $('#listModal').modal('show');
    }

    function openEditPost() {
        $('#editPostModal').modal('show');
    }

    function openConfirmDeletePost() {
        $('#confirmDeletePostModal').modal('show');
    }

    function openEditPhoto() {
        $('#editPhotoModal').modal('show');
    }

    function openConfirmDeletePhoto() {
        $('#confirmDeletePhotoModal').modal('show');
    }

    function openEditList() {
        $('#editListItemModal').modal('show');
    }

    function openConfirmDeleteList() {
        $('#confirmDeleteListModal').modal('show');
    }

    function openEditEvent() {
        $('#editEventModal').modal('show');
    }

    function openConfirmDeleteEvent() {
        $('#confirmDeleteEventModal').modal('show');
    }

    function openEditComment() {
        $('#editCommentModal').modal('show');
    }
    
    function openConfirmDeleteComment() {
        $('#confirmDeleteCommentModal').modal('show');
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

            const postId = data.id;
            const feedId = data.feedId;


            const newPostDiv = document.createElement('div');
            newPostDiv.className = 'post mx-5 p-4 mt-4';
            newPostDiv.setAttribute('data-post-container', '')
    

            newPostDiv.innerHTML = `
                ${ PostsFeedHeader }

                <div class="post_content w-100 mx-5 my-4">
                    <p class=" fs-5 ms-3" id="postContent"> ${ content }</p>
                </div>

                <!-- component -->
                <div class="like_comments bg-body d-flex flex-column">
                    <span class="mx-3 fs-5 LikeNums"></span>
                    <div class="like_comment_component bg-body  d-flex row">
                        <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" onclick="toggleLike('${feedId}')">
                            <i class="fa-regular fa-thumbs-up pt-1 likeCreated" data-feed-id='${feedId}'></i>
                            <p class="mb-0 ms-2 fs-5 likeCreated">like</p>
                        </div>
                        <div class="commentSection comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" >
                            <i class="fa-solid fa-comment pt-1"></i>
                            <p class="mb-0 ms-2 fs-5">comment</p>
                        </div>
                    </div>
                </div>

                <!-- comment component -->
                <div class="commentComponent comment-component d-flex w-100 mx-auto gap-4 mt-3">
                    <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:40px !important; height:40px !important; border-radius:50%">
                    <form action="" class="d-flex flex-grow-1">
                        <input type="text" class="w-100 p-2 commentInput" data-feed-id='${feedId}'>
                    </form>
                    <button type="button" class="btn btn-secondary bg-light ms-auto" onclick="createComments('${feedId}')">
                        <i class="fa-solid fa-paper-plane font"></i>
                    </button>
                </div>
                    `;

            const feedBodyDiv = document.getElementById('feedBody');
            feedBodyDiv.appendChild(newPostDiv);

            Array.from(document.getElementsByClassName('userFeedImage')).forEach(element => {          
                element.src = `../../images/${userProfile}` ? `../../images/${userProfile}` : '/imgs/user.webp';
            });
            document.getElementById('post').setAttribute('data-post-id', postId);
            document.getElementById('post').setAttribute('data-feed-id', feedId);

            document.getElementById('content').value = '';
        })
        .catch(error => {
            console.error('Error creating post:', error);
        });
    }

    function uploadPhoto() {
        const fileInput = document.getElementById('photoInput');
        const file = fileInput.files[0];
        const caption = document.getElementById('caption').value? document.getElementById('caption').value : 'sharing this photo with you !';
    
        if (!file) {
            const fileErrorSpan = document.getElementById('photoInputError');
            fileErrorSpan.textContent = 'You need to choose a file!';
            return;
        }

        if (!caption) {
            const captionErrorSpan = document.getElementById('captionError');
            captionErrorSpan.textContent = 'if no caption added we will add this default caption';
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

            const photoId = data.id;
            const feedId = data.feedId;
    
            const uploadedPhoto = data.photo;
            let photoCaption;
            if (data.caption === 'sharing this photo with you !') {
                photoCaption = "";
            }
            else {
                photoCaption = data.caption;
            }

            const newPhotoDiv = document.createElement('div');
            newPhotoDiv.className = 'photo mx-5 p-4 mt-4';
            newPhotoDiv.setAttribute('data-post-container', '')
    
            newPhotoDiv.innerHTML = `
                ${ PhotosFeedHeader }

                <div class="feed_content">
                    <p class="pt-3 pb-0 mb-0 ms-5 fs-5" id="photoCaption">${photoCaption}</p>
                    <img src="../../images/${uploadedPhoto}" alt="" class="w-100 mx-3 my-1">
                </div>

                <!-- component -->
                <div class="like_comments bg-body d-flex flex-column">
                    <span class="mx-3 fs-5 LikeNums"></span>
                    <div class="like_comment_component bg-body  d-flex row">
                        <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" onclick="toggleLike('${feedId}')">
                            <i class="fa-regular fa-thumbs-up pt-1 likeCreated" data-feed-id='${feedId}'></i>
                            <p class="mb-0 ms-2 fs-5 likeCreated">like</p>
                        </div>
                        <div class="commentSection comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" >
                            <i class="fa-solid fa-comment pt-1"></i>
                            <p class="mb-0 ms-2 fs-5">comment</p>
                        </div>
                    </div>
                </div>

                <!-- comment component -->
                <div class="commentComponent comment-component d-flex w-100 mx-auto gap-4 mt-3">
                <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:40px !important; height:40px !important; border-radius:50%">
                <form action="" class="d-flex flex-grow-1">
                    <input type="text" class="w-100 p-2 commentInput" data-feed-id='${feedId}'>
                </form>
                <button type="button" class="btn btn-secondary bg-light ms-auto" onclick="createComments('${feedId}')">
                    <i class="fa-solid fa-paper-plane font"></i>
                </button>
            </div>
                `;
    
            const feedBodyDiv = document.getElementById('feedBody');
            feedBodyDiv.appendChild(newPhotoDiv);

            Array.from(document.getElementsByClassName('userFeedImage')).forEach(element => {          
                element.src = `../../images/${userProfile}` ? `../../images/${userProfile}` : '/imgs/user.webp';
            });

            document.getElementById('photo').setAttribute('data-photo-id', photoId);
            document.getElementById('photo').setAttribute('data-feed-id', feedId);

            document.getElementById('photoInput').value = '';
            document.getElementById('caption').value = '';
    
            $('#photoModal').modal('hide');
        })
        .catch(error => {
            console.error('Error uploading photo:', error);
        });
    }
        

    function createEvents() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const eventTitle = document.getElementById('eventTitle').value.charAt(0).toUpperCase() + document.getElementById('eventTitle').value.slice(1);;
        const eventDescription = document.getElementById('eventDescription').value;    

        const { day, month } = formatDate(startDate, { monthFormat: 'long' });

        if (!eventTitle) {
            const titleErrorSpan = document.getElementById('eventTitleError');
            titleErrorSpan.textContent = 'title is not allowed to be empty';
        }
        if (!eventDescription) {
            const descriptionErrorSpan = document.getElementById('eventDescriptionError');
            descriptionErrorSpan.textContent = 'title is not allowed to be empty';
        }
        if (!startDate) {
            const startDateErrorSpan = document.getElementById('eventStartDateError');
            startDateErrorSpan.textContent = 'please provide a valid date' ;
        }
        if (!endDate) {
            const endDateErrorSpan = document.getElementById('eventEndDateError');
            endDateErrorSpan.textContent = 'please provide a valid date';
        }
        
        const isoStartDate = new Date(startDate).toISOString();
        const isoEndDate = new Date(endDate).toISOString();

        const requestBody = {
            startDate: isoStartDate,
            endDate: isoEndDate ? isoEndDate : isoStartDate,
            title: eventTitle,
            description: eventDescription
        };
    
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
            const eventId = data.id;
            const feedId = data.feedId;

            const newEventDiv = document.createElement('div');
            newEventDiv.className = 'event mx-5 p-4 mt-4';
            newEventDiv.setAttribute('data-post-container', '')

            newEventDiv.innerHTML = `
                ${ EventsFeedHeader }

                <div class="feed_content w-100" style="height: 150px">
                    <div class="event_component d-flex mx-1 my-4 w-100 h-100 border-1" >
                        <div class="date d-flex flex-column border-end-1 justify-content-center p-2 align-items-center fs-3 bg-body-secondary w-25 h-100">
                            <h4 id="startDateMonth"> ${ month } </h4>
                            <h1 id="startDateDay" > ${ day } </h1>
                        </div>
                        <div class="description d-flex flex-column justify-content-around ps-4 bg-info w-75 h-100">
                            <div class="event_title fs-4">
                                <h2 class="fw-bold ps-1 text-light pb-2" style="border-bottom: 2px solid white" id="eventTitle" >${ eventTitle }</h2>
                            </div>
                            <div class="event_description ps-3 fs-5 mt-0">
                                <h5 class="ms-3 text-light" id="eventDescription">${ eventDescription }</h5>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- component -->
                <div class="like_comments bg-body d-flex flex-column">
                    <span class="mx-3 fs-5 LikeNums"></span>
                    <div class="like_comment_component bg-body  d-flex row">
                        <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" onclick="toggleLike('${feedId}')">
                            <i class="fa-regular fa-thumbs-up pt-1 likeCreated" data-feed-id='${feedId}'></i>
                            <p class="mb-0 ms-2 fs-5 likeCreated">like</p>
                        </div>
                        <div class="commentSection comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" >
                            <i class="fa-solid fa-comment pt-1"></i>
                            <p class="mb-0 ms-2 fs-5">comment</p>
                        </div>
                    </div>
                </div>

                <!-- comment component -->
                <div class="commentComponent comment-component d-flex w-100 mx-auto gap-4 mt-3">
                <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:40px !important; height:40px !important; border-radius:50%">
                <form action="" class="d-flex flex-grow-1">
                    <input type="text" class="w-100 p-2 commentInput" data-feed-id='${feedId}'>
                </form>
                <button type="button" class="btn btn-secondary bg-light ms-auto" onclick="createComments('${feedId}')">
                    <i class="fa-solid fa-paper-plane font"></i>
                </button>
            </div>
            `;

            const feedBodyDiv = document.getElementById('feedBody');
            feedBodyDiv.appendChild(newEventDiv);
            Array.from(document.getElementsByClassName('userFeedImage')).forEach(element => {          
                element.src = `../../images/${userProfile}` ? `../../images/${userProfile}` : '/imgs/user.webp';
            });

            document.getElementById('event').setAttribute('data-event-id', eventId);
            document.getElementById('event').setAttribute('data-feed-id', feedId);

            if (data.hasOwnProperty('id')) {
                document.getElementById('startDate').value = '';
                document.getElementById('endDate').value = '';
                document.getElementById('eventTitle').value = '';
                document.getElementById('eventDescription').value = '';
                $('#eventModal').modal('hide');
            }

        })
        .catch(error => {
            console.error('Error creating event:', error);
        });
    }


    function addContact() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const type = document.getElementById('type').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const email = document.getElementById('email').value;
        const photoInput = document.getElementById('photoInput');
        const note = document.getElementById('note').value;

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('type', type);
        formData.append('phoneNumber', phoneNumber);
        formData.append('email', email);
        formData.append('photoInput', photoInput.files[0]);
        formData.append('note', note);

        fetch(`/api/v1/circles/${circleId}/contactbooks/`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Contact created successfully:', data);
            if (data.hasOwnProperty('id')) {
                document.getElementById('firstName').value = '';
                document.getElementById('lastName').value = '';
                document.getElementById('type').value = '';
                document.getElementById('phoneNumber').value = '';
                document.getElementById('email').value = '';
                document.getElementById('photoInput').value = '';
                document.getElementById('note').value = '';
                $('#contactModal').modal('hide');
            } else {

                if (data.message.includes('note')) {
                    const noteErrorSpan = document.getElementById('contactNoteError');
                    noteErrorSpan.textContent = data.message;
                } 
                if (data.message.includes('email')) {
                    const emailErrorSpan = document.getElementById('contactEmailError');
                    emailErrorSpan.textContent = data.message;
                }
                if (data.message.includes('phoneNumber')) {
                    const phoneNumberErrorSpan = document.getElementById('contactPhoneError');
                    phoneNumberErrorSpan.textContent = data.message;
                }
                if (data.message.includes('lastName')) {
                    const lastNameErrorSpan = document.getElementById('contactLastError');
                    lastNameErrorSpan.textContent = data.message;
                }
                if (data.message.includes('firstName')) {
                    const firstNameErrorSpan = document.getElementById('contactFirstError');
                    firstNameErrorSpan.textContent = data.message;
                }
                if (data.message.includes('type')) {
                    const typeErrorSpan = document.getElementById('contactTypeError');
                    typeErrorSpan.textContent = data.message;
                }
                if (data.message.includes('photo')) {
                    const photoErrorSpan = document.getElementById('contactPhotoError');
                    photoErrorSpan.textContent = data.message;
                }
            }
        })
        .catch(error => {
            console.error('Error adding contact:', error);
            const errorSpan = document.getElementById('contactError');
            errorSpan.textContent = 'Error adding contact. Please try again.';
        });
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
        $('#editPostModal .close, #editPostModal button[data-dismiss="modal"]').click(function () {
            $('#editPostModal').modal('hide');
        });

        $('#confirmDeletePostModal .close, #confirmDeletePostModal button[data-dismiss="modal"]').click(function () {
            $('#confirmDeletePostModal').modal('hide');
        });

        $('#editPhotoModal .close, #editPhotoModal button[data-dismiss="modal"]').click(function () {
            $('#editPhotoModal').modal('hide');
        });

        $('#confirmDeletePhotoModal .closedelete, #confirmDeletePhotoModal button[data-dismiss="modal"]').click(function () {
            $('#confirmDeletePhotoModal').modal('hide');
        });

        $('#editEventModal .close, #editEventModal button[data-dismiss="modal"]').click(function () {
            $('#editEventModal').modal('hide');
        });

        $('#confirmDeleteEventModal .close, #confirmDeleteEventModal button[data-dismiss="modal"]').click(function () {
            $('#confirmDeleteEventModal').modal('hide');
        });

        $('#editListItemModal .close, #editListItemModal button[data-dismiss="modal"]').click(function () {
            $('#editListItemModal').modal('hide');
        });

        $('#confirmDeleteListModal .close, #confirmDeleteListModal button[data-dismiss="modal"]').click(function () {
            $('#confirmDeleteListModal').modal('hide');
        });

        $('#editCommentModal .close, #editCommentModal button[data-dismiss="modal"]').click(function () {
            $('#editCommentModal').modal('hide');
        });

        $('#confirmDeleteCommentModal .close, #confirmDeleteCommentModal button[data-dismiss="modal"]').click(function () {
            $('#confirmDeleteCommentModal').modal('hide');
        });
    });

    // ===================================
    // ===================================

    function editPost() {
        const newContent = document.getElementById('newContent').value;
        const postId = document.getElementById('post').getAttribute('data-post-id');
        const feedId = document.getElementById('post').getAttribute('data-feed-id');
        const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${feedId}/posts/${postId}`;

        const requestBody = {
            content: newContent
        };

        fetch(url, {
            method: 'PUT',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Post edited successfully:', data);
            document.getElementById('postContent').textContent = newContent;
            document.getElementById('newContent').value = '';
            $('#editPostModal').modal('hide');
        })
        .catch(error => {
            console.error('Error editing post:', error);
        });
        
    }

    function deletePost() {
        const postId = document.getElementById('post').getAttribute('data-post-id');
        const feedId = document.getElementById('post').getAttribute('data-feed-id');

        const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${feedId}`;

        fetch(url, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Post deleted successfully:', data);
            $('#confirmDeletePostModal').modal('hide');
            $('.post').css('display', 'none');
        })
        .catch(error => {
            console.error('Error deleting post:', error);
        });
    }

    // ===================== Photo =================

    function editPhoto() {
        // TO DO
        const newCaption = document.getElementById('newCaption').value;
        const feedId = document.getElementById('photo').getAttribute('data-feed-id');
        const photoId = document.getElementById('photo').getAttribute('data-photo-id');

        const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${feedId}/photos/${photoId}`;

        const requestBody = {
            caption: newCaption
        };

        fetch(url, {
            method: 'PUT',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Photo edited successfully:', data);
            document.getElementById('photoCaption').textContent = newCaption;
            document.getElementById('newCaption').value = '';
            $('#editPhotoModal').modal('hide');
        })
        .catch(error => {
            console.error('Error editing photo:', error);
        });


    }

    function deletePhoto() {
        // TO DO
        const feedId = document.getElementById('photo').getAttribute('data-feed-id');
    
        const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${feedId}`;

        fetch(url, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Photo deleted successfully:', data);
            $('#confirmDeletePhotoModal').modal('hide');
            $('.photo').css('display', 'none');
        })
        .catch(error => {
            console.error('Error deleting photo:', error);
        });
    }

    // ===================== Event =================

    function editEvent() {
        // TO DO
        const newStartDate = document.getElementById('newStartDate').value? document.getElementById('newStartDate').value : document.getElementById('startDate').value;
        const newEndDate = document.getElementById('newEndDate').value? document.getElementById('newEndDate').value : document.getElementById('endDate').value;
        const newTitle = document.getElementById('newTitle').value? document.getElementById('newTitle').value : document.getElementById('eventTitle').value;
        const newDescription = document.getElementById('newDescription').value? document.getElementById('newDescription').value : document.getElementById('eventDescription').value;
        const feedId = document.getElementById('event').getAttribute('data-feed-id');
        const eventId = document.getElementById('event').getAttribute('data-event-id');

        url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${feedId}/events/${eventId}`;

        const isoStartDate = new Date(newStartDate).toISOString();
        const isoEndDate = new Date(newEndDate).toISOString();

        const requestBody = {
            startDate: isoStartDate,
            endDate: isoEndDate ? isoEndDate : isoStartDate,
            title: newTitle,
            description: newDescription
        };

        const { day, month } = formatDate(newStartDate, { monthFormat: 'long' });


        fetch(url, {
            method: 'PUT',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Event edited successfully:', data);

            document.getElementById('eventTitle').textContent =  newTitle.charAt(0).toUpperCase() + newTitle.slice(1);
            document.getElementById('eventDescription').textContent = newDescription;
            document.getElementById('startDateDay').textContent = day;
            document.getElementById('startDateMonth').textContent = month;
            document.getElementById('newTitle').value = '';
            document.getElementById('newDescription').value = '';
            document.getElementById('newStartDate').value = '';
            document.getElementById('newEndDate').value = '';

            $('#editEventModal').modal('hide');
        })
        .catch(error => {
            console.error('Error editing event:', error);
        });

    }

    function deleteEvent() {
        // TO DO
        const feedId = document.getElementById('event').getAttribute('data-feed-id');
        const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${feedId}`;

        fetch(url, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Event deleted successfully:', data);
            $('#confirmDeleteEventModal').modal('hide');
            $('.event').css('display', 'none');
        })
        .catch(error => {
            console.error('Error deleting event:', error);
        });
    }


    function createComments(feedId) {
        const commentInput = document.querySelector(`.commentInput[data-feed-id="${feedId}"]`);
        const feed = feedId;
        const user = userId;
        const content = commentInput.value.trim();
        const circle = circleId;
        const url = `/api/v1/circles/${circle}/feeds/${feed}/comments/`;

        const commentData = {
            content: content,
            userId: user,
        };
    
        if (content !== "") {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to create comment');
                }
            })
            .then(comment => {
                console.log('Comment created:', comment);
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comments d-flex flex-column';
                commentDiv.innerHTML = `
                <div class="comment_content d-flex flex-column w-100" id="comment" data-comment-id='${comment.id}' data-feed-id='${comment.feedId}'>
                    <div class="d-flex mt-3 justify-content-between ms-2 mb-1">
                        <div class="d-flex comment-header mt-3 ms-2 mb-1">
                            <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:45px !important; height:45px !important; border-radius:50% !important" >
                            <h5 class="ms-2">${ userFirstName } :</h5>
                            <h6 class="ms-0 px-2 mt-0 pt-0" >${ comment.content }</h6>
                        </div>
                        <div class="dropdown-container position-relative d-inline-block">
                            <i class="fa-solid fa-ellipsis-vertical w-25" onclick="toggleDropdown(event)"></i>
                            <ul class="dropdown ms-0 ps-0 list-unstyled position-absolute top-0 bg-light z-3">
                                <li class="edit mb-1 w-100 text-start p-2" onclick="openEditComment()">Edit</li>
                                <li class="delete w-100 text-start p-2" onclick="openConfirmDeleteComment()">Delete</li>
                            </ul>
                        </div>
                `;
    
                const postContainer = commentInput.closest('[data-post-container]');
                if (postContainer) {
                    postContainer.appendChild(commentDiv);
                } else {
                    console.error('Post container not found for feedId:', feedId);
                }
                commentInput.value = '';
            })
            .catch(error => {
                console.error('Error creating comment:', error.message);
            });
        }
    }

    function toggleLike(feedId) {
        const url = `/api/v1/circles/${circleId}/feeds/${feedId}/likes/`;
    
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0 && data[0].deleted === false) {
                deleteLike(feedId);
            } else {
                createLike(feedId);
            }
        })
        .catch(error => {
            console.error('Error checking like status:', error);
        });
    }
    
    function createLike(feedId) {
        const likeData = {
            userId: userId
        };
    
        const url = `/api/v1/circles/${circleId}/feeds/${feedId}/likes/`;
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
            },
            body: JSON.stringify(likeData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Like created successfully:', data);
            updateLikeUI(feedId, true);
        })
        .catch(error => {
            console.error('Error creating like:', error);
        });
    }
    
    function deleteLike(feedId) {
        const likeData = {
            userId: userId
        };
    
        const url = `/api/v1/circles/${circleId}/feeds/${feedId}/likes/`;
    
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
            },
            body: JSON.stringify(likeData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Like deleted successfully:', data);
            updateLikeUI(feedId, false);
        })
        .catch(error => {
            console.error('Error deleting like:', error);
        });
    }
    
    function updateLikeUI(feedId, isLiked) {
        const elements = document.querySelectorAll(`[data-feed-id="${feedId}"].likeCreated`);
    
        elements.forEach(element => {
            location.reload();
            element.style.color = isLiked ? '#0dcaf0' : 'black';
        });
    }

    // ===================================

    function editComment() {
        const newComment = document.getElementById('newComment').value;
        const commentId = document.getElementById('comment').getAttribute('data-comment-id');
        const feedId = document.getElementById('comment').getAttribute('data-feed-id');


        const url = `/api/v1/circles/${circleId}/feeds/${feedId}/comments/${commentId}`;

        const requestBody = {
            content: newComment,
            userId: userId
        };

        fetch(url, {
            method: 'PUT',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Comment edited successfully:', data);
            document.getElementById('newComment').value = '';
            $('#editCommentModal').modal('hide');
            document.getElementById('commentContent').textContent = newComment;
        })
        .catch(error => {
            console.error('Error editing comment:', error);
        });


    }

    // Function to delete a comment

    function deleteComment() {
        // TO DO
        const commentId = document.getElementById('comment').getAttribute('data-comment-id');
        const feedId = document.getElementById('comment').getAttribute('data-feed-id');
        const url = `/api/v1/circles/${circleId}/feeds/${feedId}/comments/${commentId}`;

        const requestBody = {
            deleted: true,
            userId: userId
        };

        fetch(url, {
            method: 'DELETE',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Comment deleted successfully:', data);
            $('#confirmDeleteCommentModal').modal('hide');
            document.getElementById('comment').style.display = 'none';
        })
        .catch(error => {
            console.error('Error deleting comment:', error);
        });

    }

    // get lists by circle id 

    function getLists() {
        const url = `/api/v1/circles/${circleId}/lists/`;
    
        fetch(url)
        .then(response => response.json())
        .then(data => {
            // console.log('Lists retrieved successfully:', data);
            const lists = data;
            const modalBody = document.getElementById('existingListsSelect');
            const selectList = document.getElementById('existingLists');
    
            lists.forEach(list => {
                const option = document.createElement('option');
                option.style.width = '200px !important';
                option.value = list.list.id;
                option.text = list.list.name; 
                option.setAttribute('data-feed-id', list.list.feedId);
                selectList.appendChild(option);
            });
    
            modalBody.appendChild(selectList);
        })
        .catch(error => {
            console.error('Error getting lists:', error.message);
        });
    }

    getLists();


    function createList() {
        const listName = document.getElementById('listName').value;

        const Listdata = {
            name: listName,
            userId: userId,
        }; 
    
        const url = `/api/v1/circles/${circleId}/users/${userId}/lists/`;
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Listdata),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to create list');
                }
            })
            .then(list => {
                console.log('List created successfully:', list.id);
                const listItemsInput = document.getElementById('listItems');
                const existingListsError = document.getElementById('existingListsError');
    
                const feedId = list.feedId;

                listNameError.textContent = '';
                existingListsError.textContent = '';

                const requestBody = {
                    name: listItemsInput.value.trim()
                };

                const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${list.feedId}/lists/${list.id}/listItems/`;

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
                    console.log('List items created successfully:', data);
                    const listItemId = data.id;
                    const listId = data.listId;
            
                    const newListDiv = document.createElement('div');
                    newListDiv.className = 'lists mx-5 p-4 mt-4';
                    newListDiv.setAttribute('data-post-container', '')
            
                    newListDiv.innerHTML = `
                        <!-- component -->
                        ${ listsFeedHeader }
                        <div class="feed_content">
                            <form action="" class="mx-5 my-3 d-flex">
                                
                                    <label class="check-list" id="listItemInput">
                                        <input type="checkbox">
                                        <div class="checkmark" id="listItem" onclick="doneListItem(this)" data-feed-id='${ feedId }' data-list-id='${listId}' data-listItem-id='${ listItemId }'></div>
                                        ${ data.name }
                                    </label>
                            </form>
                        </div>

                        <!-- component -->
                        <div class="like_comments bg-body d-flex flex-column">
                            <span class="mx-3 fs-5 LikeNums"></span>
                            <div class="like_comment_component bg-body  d-flex row">
                                <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" onclick="toggleLike('${feedId}')">
                                    <i class="fa-regular fa-thumbs-up pt-1 likeCreated" data-feed-id='${feedId}'></i>
                                    <p class="mb-0 ms-2 fs-5 likeCreated">like</p>
                                </div>
                                <div class="commentSection comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" >
                                    <i class="fa-solid fa-comment pt-1"></i>
                                    <p class="mb-0 ms-2 fs-5">comment</p>
                                </div>
                            </div>
                        </div>

                        <!-- comment component -->
                        <div class="commentComponent comment-component d-flex w-100 mx-auto gap-4 mt-3">
                        <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:40px !important; height:40px !important; border-radius:50%">
                        <form action="" class="d-flex flex-grow-1">
                            <input type="text" class="w-100 p-2 commentInput" data-feed-id='${feedId}'>
                        </form>
                        <button type="button" class="btn btn-secondary bg-light ms-auto" onclick="createComments('${feedId}')">
                            <i class="fa-solid fa-paper-plane font"></i>
                        </button>
                    </div>

                    `;
            
                    const feedBodyDiv = document.getElementById('feedBody');
                    feedBodyDiv.appendChild(newListDiv);
                    Array.from(document.getElementsByClassName('userFeedImage')).forEach(element => {          
                        element.src = `../../images/${userProfile}` ? `../../images/${userProfile}` : '/imgs/user.webp';
                    });
                    
                    document.getElementById('list').setAttribute('data-list-id', listId);
                    document.getElementById('list').setAttribute('data-feed-id', feedId);

                    $('#listModal').modal('hide');
                })
                .catch(error => {
                    console.error('Error creating list items:', error);
                });
            })
            .catch(error => {
                console.error('Error creating list:', error.message);
            });

    }
    
    // createList();
    
    // create list items

    function createListItems() {

        const newListInput = document.getElementById('listName');
        const newListName = newListInput.value.trim();
        
        if (newListName !== '') {
            createList();
        }
        const existingListsSelect = document.getElementById('existingLists');
        const listItemsInput = document.getElementById('listItems');
        const listNameError = document.getElementById('listNameError');
        const existingListsError = document.getElementById('existingListsError');
    
        listNameError.textContent = '';
        existingListsError.textContent = '';
    
        const selectedListId = existingListsSelect.value;
        const selectedListFeedId = existingListsSelect.options[existingListsSelect.selectedIndex].getAttribute('data-feed-id');
        const listItem = listItemsInput.value.trim();
    
        if (!newListName && !selectedListId) {
            listNameError.textContent = 'Please enter a new list name or choose an existing list.';
            existingListsError.textContent = 'Please enter a new list name or choose an existing list.';
            return;
        }
    
            const requestBody = {
                name: listItem
            };
            const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${selectedListFeedId}/lists/${selectedListId}/listItems/`;
    
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
                console.log('List items created successfully:', data);
                const listItemId = data.id;
                const listId = data.listId;
        
                const newListDiv = document.createElement('div');
                newListDiv.className = 'lists mx-5 p-4 mt-4';
                newListDiv.setAttribute('data-post-container', '')
        
                newListDiv.innerHTML = `
                    <!-- component -->
                    ${ listsFeedHeader }
        
                    <div class="feed_content">
                        <form action="" class="mx-5 my-3 d-flex">
                            
                                <label class="check-list">
                                    <input type="checkbox"  id="listItemInput">
                                    <div class="checkmark" id="listItem" onclick="doneListItem(this)" data-feed-id='${ selectedListFeedId }' data-list-id='${listId}' data-listItem-id='${ listItemId }'></div>
                                    ${ data.name }
                                </label>
                        </form>
                    </div>
        
                    <!-- component -->
                    <div class="like_comments bg-body d-flex flex-column">
                        <span class="mx-3 fs-5 LikeNums"></span>
                        <div class="like_comment_component bg-body  d-flex row">
                            <div class="like col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" onclick="toggleLike('${selectedListFeedId}')">
                                <i class="fa-regular fa-thumbs-up pt-1 likeCreated" data-feed-id='${selectedListFeedId}'></i>
                                <p class="mb-0 ms-2 fs-5 likeCreated">like</p>
                            </div>
                            <div class="commentSection comment col-md-5 d-flex fs-5 justify-content-center my-auto mx-auto" >
                                <i class="fa-solid fa-comment pt-1"></i>
                                <p class="mb-0 ms-2 fs-5">comment</p>
                            </div>
                        </div>
                    </div>

                    <!-- comment component -->
                    <div class="commentComponent comment-component d-flex w-100 mx-auto gap-4 mt-3">
                    <img src="../../images/${userProfile}" alt="" class="userCommentImage" style="width:40px !important; height:40px !important; border-radius:50%">
                    <form action="" class="d-flex flex-grow-1">
                        <input type="text" class="w-100 p-2 commentInput" data-feed-id='${selectedListFeedId}'>
                    </form>
                    <button type="button" class="btn btn-secondary bg-light ms-auto" onclick="createComments('${feedId}')">
                        <i class="fa-solid fa-paper-plane font"></i>
                    </button>
                </div>
                `;
        
                const feedBodyDiv = document.getElementById('feedBody');
                feedBodyDiv.appendChild(newListDiv);
                Array.from(document.getElementsByClassName('userFeedImage')).forEach(element => {          
                    element.src = `../../images/${userProfile}` ? `../../images/${userProfile}` : '/imgs/user.webp';
                });
                
                document.getElementById('listItem').setAttribute('data-list-id', listId);
                document.getElementById('listItem').setAttribute('data-feed-id', selectedListFeedId);

                $('#listModal').modal('hide');
            })
            .catch(error => {
                console.error('Error creating list items:', error);
                
            });
        }



    function doneListItem(checkbox) {
        // TO DO
        checkbox.checked = true;
        
        // ==================================
        const feedId = checkbox.getAttribute('data-feed-id');
        const listId = checkbox.getAttribute('data-list-id');
        const listItemId = checkbox.getAttribute('data-listItem-id');

        const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${feedId}/lists/${listId}/listItems/${listItemId}`;

        const requestBody = {
            checked: true
        };

        fetch(url, {
            method: 'PUT',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log('List item done successfully:', data);
        })
        .catch(error => {
            console.error('Error done list item:', error);
        });
    }


    function editListItem() {
        // TO DO

        const newListItem = document.getElementById('newListItem').value;

        const feedId = document.getElementById('listItem').getAttribute('data-feed-id');
        const listId = document.getElementById('listItem').getAttribute('data-list-id');
        const listItemId = document.getElementById('listItem').getAttribute('data-listItem-id');

        const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${feedId}/lists/${listId}/listItems/${listItemId}`;

        const requestBody = {
            name: newListItem
        };

        fetch(url, {
            method: 'PUT',
            headers : {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log('List item done successfully:', data);
            document.getElementById('newListItem').value = '';
            $('#editListItemModal').modal('hide');
            document.getElementById('listItemInput').textContent = newListItem;
        })
        .catch(error => {
            console.error('Error done list item:', error);
        });

    }

    function deleteListItem() {
        // TO DO
        const feedId = document.getElementById('listItem').getAttribute('data-feed-id');
        const listId = document.getElementById('listItem').getAttribute('data-list-id');
        const listItemId = document.getElementById('listItem').getAttribute('data-listItem-id');
        const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${feedId}/lists/${listId}/listItems/${listItemId}`;

        fetch(url, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('List deleted successfully:', data);
            $('#confirmDeleteListModal').modal('hide');
            $('.lists').css('display', 'none');
        })
        .catch(error => {
            console.error('Error deleting post:', error);
        });
    }


    window.openContactModal = openContactModal;
    window.openPhotoModal = openPhotoModal;
    window.openEventModal = openEventModal;
    window.openListModal = openListModal;
    window.createPost = createPost;
    window.uploadPhoto = uploadPhoto;
    window.createEvents = createEvents;
    window.createList = createList;
    window.addContact = addContact;
    window.openEditPost = openEditPost;
    window.openConfirmDeletePost = openConfirmDeletePost;
    window.editPost = editPost;
    window.deletePost = deletePost;
    window.openEditPhoto = openEditPhoto;
    window.openConfirmDeletePhoto = openConfirmDeletePhoto;
    window.editPhoto = editPhoto;
    window.deletePhoto = deletePhoto;
    window.openEditEvent = openEditEvent;
    window.openConfirmDeleteEvent = openConfirmDeleteEvent;
    window.editEvent = editEvent;
    window.deleteEvent = deleteEvent;
    window.openEditList = openEditList;
    window.openConfirmDeleteList = openConfirmDeleteList;
    window.editListItem = editListItem;
    window.deleteListItem = deleteListItem;
    window.createComments = createComments;
    window.toggleLike = toggleLike;
    window.openEditComment = openEditComment;
    window.openConfirmDeleteComment = openConfirmDeleteComment;
    window.editComment = editComment;
    window.deleteComment = deleteComment;
    window.createListItems = createListItems;
    window.doneListItem = doneListItem;

});