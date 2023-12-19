const getElement = (id) => document.getElementById(id);
const lists = getElement('lists');
const addListBtn = getElement('addListBtn');
const listsContainer = getElement('listsContainer');
const modalContainer = getElement('modalContainer');
const createEditModal = getElement('createEditModal');
const deleteModal = getElement('deleteModal');
const listNameInput = getElement('listName');
const modalSubmitBtn = getElement('modalSubmit');
const confirmDelete = getElement('confirmDelete');
const cancelDelete = getElement('cancelDelete');
const errMsg = getElement('errMsg');
const modalTitle = getElement('modalTitle');
const listItems = getElement('listItems');
const listNameToListItems = getElement('listTitle');
const labelListName = getElement('labelListName');
const listItemInput = getElement('listItemInput');
const listItemsBox = getElement('listItemsBox');
const freeList = getElement('freeList');
const listItemErrMsg = getElement('listItemErrMsg');
const modal = getElement('editDeleteList');
const ellipsisIcon = getElement('ellipsisIcon');
const editButton = getElement('editListButton');
const deleteButton = getElement('deleteListButton');
const backBtn = getElement('backBtn');

const listItemsMain = document.querySelector('.main-list-items-container');
const listItemsFree = document.querySelector('.free-list-items');


let clickedTarget;

const url = `/api/v1/circles/${circleId}/lists`;

getAllLists(url);

// http methods
async function getAllLists(url) {
    try {
        const response = await fetch(url);
        const responseData = await response.json();

        if (response.status === 200) {
            const lists = getListsFromResponse(responseData);
            await handleListsDataFromGetMethod(lists);
        }
    } catch (err) {
        console.error(err);
    }
}

async function getList(url) {
    try {
        const response = await fetch(url);
        const responseData = await response.json();

        if (response.status === 200) {
            return responseData;
        }
    } catch (err) {
        console.error(err);
    }
}

async function getAllListItems(url) {
    try {
        const response = await fetch(url);
        const responseData = await response.json();

        if (response.status === 200) {
            return responseData;
        }
    } catch (err) {
        console.error(err);
    }
}

async function createNewList(url, reqBody) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: reqBody,
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const responseData = await response.json();

        if (response.status === 201) {
            location.reload();
        } else if (response.status === 400) {
            handleErrMsg(responseData);
        }
    } catch (err) {
        console.error(err);
    }
}

async function editList(url, reqBody) {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: reqBody,
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const responseData = await response.json();

        if (response.status === 200) {
            location.reload();
        } else if (response.status === 400) {
            handleErrMsg(responseData);
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteList(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (response.status === 200) {
            location.reload();
        }
    } catch (err) {
        console.error(err);
    }
}

async function createNewListItem(url, reqBody) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: reqBody,
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const responseData = await response.json();

        if (response.status === 201) {
            location.reload();
        } else if (response.status === 400) {
            handleListItemsErr(responseData);
        }
    } catch (err) {
        console.error(err);
    }
}

async function editListItem(url, reqBody) {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: reqBody,
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const responseData = await response.json();

        if (response.status === 200) {
            location.reload();
        } else if (response.status === 400) {
            handleErrMsg(responseData);
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteListItem(url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (response.status === 200) {
            location.reload();
        }
    } catch (err) {
        console.error(err);
    }
}

// logic methods
function getListsFromResponse(responseData) {
    const lists = [];
    responseData.forEach(feed => {
        const list = feed.list;
        list['userId'] = feed.userId;
        lists.push(list)
    });

    return lists;
}

async function handleListsDataFromGetMethod(data) {
    handleListItemsDisplay(data);
    await createListBox(data);
    const firstListId = addClickedToFirstListBox();
    if (firstListId) await linkClickedListWithListItems(firstListId);
}

function handleListItemsDisplay(data) {
    if (data.length === 0) {
        listItemsMain.style.display = 'none';
        listItemsFree.style.display = 'flex ';
    } else {
        listItemsMain.style.display = 'block';
        listItemsFree.style.display = 'none';
    }
}

async function createListBox(data) {

    for (const listObject of data) {
        const newListContainer = document.createElement('div');

        const listId = listObject.id;
        const feedId = listObject.feedId;
        const feedUserId = listObject.userId;

        newListContainer.classList.add('list-box', 'd-flex', 'align-items-center', 'justify-content-between');
        newListContainer.setAttribute('onclick', 'handleListBoxClick(this)');
        newListContainer.setAttribute('id', `id-${listId}`);
        newListContainer.setAttribute('feed-id', `id-${feedId}`);
        newListContainer.setAttribute('feed-user-id', `id-${feedUserId}`);

        const url = `/api/v1/circles/${circleId}/users/${feedUserId}/feeds/${feedId}/lists/${listId}/listItems`;
        const listItemsElements = await getAllListItems(url);

        newListContainer.innerHTML = `
            <i class="fas fa-list"></i>
            <div class="text">
                <p>${listObject.name}</p>
                <span>Shared With All Members</span>
            </div>
            <span class="list-items-num">${listItemsElements.length}</span>
        `;

        listsContainer.appendChild(newListContainer);
    }
}

function addClickedToFirstListBox() {
    const listBoxes = document.querySelectorAll('.list-box');

    if (listBoxes.length > 0) {
        listBoxes[0].classList.add('clicked');
        return listBoxes[0].getAttribute('id');
    }
}

async function linkClickedListWithListItems(clickedId) {
    listItemErrMsg.textContent = '';
    listItemInput.value = '';

    const clickedElement = getElement(clickedId);
    const feedId = clickedElement.getAttribute('feed-id').slice(3);
    const feedUserId = clickedElement.getAttribute('feed-user-id').slice(3);

    const url = `/api/v1/circles/${circleId}/users/${feedUserId}/feeds/${feedId}/lists/${clickedId.slice(3)}`;
    const list = await getList(url);

    listItems.setAttribute('list-id', clickedId);
    listItems.setAttribute('feed-id', 'id-' + feedId);
    listItems.setAttribute('feed-user-id', `id-${feedUserId}`);

    listNameToListItems.textContent = list.name;

    const listItemsElements = await getAllListItems(url + '/listItems');

    if (listItemsElements.length === 0) {
        freeList.style.display = 'flex';
        listItemsBox.style.display = 'none';
    } else {
        freeList.style.display = 'none';
        listItemsBox.style.display = 'block';
        listItemsBox.textContent = '';
        listItemsElements.forEach(listItem => {
            createListItem(listItem)
        });
    }

    if (userId !== feedUserId && role === 'MEMBER') {
        const allEditIcons = document.querySelectorAll('.fa-pen');
        const allClearIcons = document.querySelectorAll('.fa-trash');

        clearAllIcons(allEditIcons);
        clearAllIcons(allClearIcons);

        ellipsisIcon.style.display = 'none';
    }
}

function clearAllIcons(icons) {
    icons.forEach(icon => {
        icon.style.display = 'none';
    });
}

function createListItem(listItem) {
    const listItemBox = document.createElement('div');
    const listItemId = 'id-' + listItem.id;
    const checkedAttr = listItem.checked ? 'checked' : '';

    listItemBox.classList.add('list-item', 'd-flex', 'align-items-center', 'gap-2');
    listItemBox.setAttribute('id', listItemId);
    listItemBox.innerHTML = `
        <input type="checkbox" id="list-item-${listItemId}" ${checkedAttr} onchange="handleCheck(this)">
        <label for="list-item-${listItemId}" class="flex-grow-1">${listItem.name}</label>
        <i class="fa-solid fa-pen"></i>
        <i class="fa-solid fa-trash"></i>
    `;

    freeList.style.display = 'none';
    listItemsBox.appendChild(listItemBox);
}

function handleErrMsg(responseData) {
    errMsg.textContent = responseData.message;
}

function handleListItemsErr(responseData) {
    listItemErrMsg.textContent = responseData.message;
}

// oneclick/onchange
function handleListBoxClick(clickedBox) {
    const listBoxes = document.querySelectorAll('.list-box');
    listBoxes.forEach(box => box.classList.remove('clicked'));

    clickedBox.classList.add('clicked');

    listItems.classList.remove('d-none', 'd-sm-block');
    lists.classList.add('d-none', 'd-sm-block');

    linkClickedListWithListItems(clickedBox.getAttribute('id'));
}

async function handleCheck(checkedListItem) {

    const listId = listItems.getAttribute('list-id').slice(3);
    const feedId = listItems.getAttribute('feed-id').slice(3);
    const listItemId = checkedListItem.getAttribute('id').slice(13);
    const url = `/api/v1/circles/${circleId}/users/${userId}/feeds/${feedId}/lists/${listId}/listItems/${listItemId}`;

    if (checkedListItem.checked) {
        const reqBody = JSON.stringify({ checked: true });
        await editListItem(url, reqBody);
    } else {
        const reqBody = JSON.stringify({ checked: false });
        await editListItem(url, reqBody);
    }
}

// show/hide modal
function showListAndListItemModal(modalConfig) {
    const setElementText = (element, text) => (element.textContent = text || '');

    setElementText(document.getElementById('modalTitle'), modalConfig.h2);
    setElementText(document.getElementById('labelListName'), modalConfig.label);
    listNameInput.placeholder = modalConfig.placeholder || '';
    modalContainer.setAttribute('type', modalConfig.type);

    createEditModal.style.display = 'flex';
    modalContainer.style.display = 'flex';
}

function hideListAndListItemModal() {
    listNameInput.value = '';
    createEditModal.style.display = 'none';
    modalContainer.style.display = 'none';
    deleteModal.style.display = 'none';
}

function closeModal() {
    hideListAndListItemModal();
}

function showEditDeleteListModal() {
    modal.style.display = 'flex';
    document.addEventListener('click', closeModalOutside);
}

function hideEditDeleteListModal() {
    modal.style.display = 'none';
    document.removeEventListener('click', closeModalOutside);
}

function closeModalOutside(event) {
    const modalContent = document.querySelector('.list-modal-edit-delete .modal-content');
    if (!modalContent.contains(event.target)) {
        hideEditDeleteListModal();
    }
}

function showDeleteConfirmationModal(deleteConfig) {
    const msg = getElement('deleteMsg');
    msg.innerHTML = deleteConfig.p;

    modalContainer.setAttribute('type', deleteConfig.type);

    modalContainer.style.display = 'flex';
    deleteModal.style.display = 'flex';
    createEditModal.style.display = 'none';
}

function hideDeleteConfirmationModal() {
    modalContainer.style.display = 'none';
    deleteModal.style.display = 'none';
    createEditModal.style.display = 'none';
}

// addEventListener functions
addListBtn.addEventListener('click', () => {
    showListAndListItemModal({
        h2: 'Create a new list',
        label: 'Enter the list name:',
        placeholder: 'List Name',
        type: 'NEW LIST'
    });
});

ellipsisIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    showEditDeleteListModal();
});

editButton.addEventListener('click', () => {
    hideEditDeleteListModal();
    showListAndListItemModal({
        h2: 'Edit List',
        label: 'Enter the list name:',
        placeholder: 'New List Name',
        type: 'EDIT LIST'
    });
});

deleteButton.addEventListener('click', () => {
    hideEditDeleteListModal();
    showDeleteConfirmationModal({
        p: 'Do you really want to delete this list?<br /> all items will be definitly deleted.',
        type: 'DELETE LIST'
    });
});

confirmDelete.addEventListener('click', async () => {
    const type = modalContainer.getAttribute('type');

    if (type === 'DELETE LIST') {
        const feedId = listItems.getAttribute('feed-id').slice(3);
        const feedUserId = listItems.getAttribute('feed-user-id').slice(3);
        const url = `/api/v1/circles/${circleId}/users/${feedUserId}/feeds/${feedId}`;

        await deleteList(url);
    } else if (type === 'DELETE LIST ITEM') {
        const listId = listItems.getAttribute('list-id').slice(3);
        const feedId = listItems.getAttribute('feed-id').slice(3);
        const feedUserId = listItems.getAttribute('feed-user-id').slice(3);
        const listItemId = deleteModal.getAttribute('list-item-id').slice(3);
        const url = `/api/v1/circles/${circleId}/users/${feedUserId}/feeds/${feedId}/lists/${listId}/listItems/${listItemId}`;

        await deleteListItem(url);
    }
});

cancelDelete.addEventListener('click', () => {
    hideDeleteConfirmationModal();
});


listForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    listItemErrMsg.textContent = '';

    const listItem = listItemInput.value.trim();
    const reqBody = JSON.stringify({ name: listItem });

    const listId = listItems.getAttribute('list-id').slice(3);
    const feedId = listItems.getAttribute('feed-id').slice(3);
    const feedUserId = listItems.getAttribute('feed-user-id').slice(3);

    if (feedUserId !== userId && role === 'MEMBER') {
        listItemErrMsg.textContent = 'You are not allowed to create a new list item';
        return;
    }
    const url = `/api/v1/circles/${circleId}/users/${feedUserId}/feeds/${feedId}/lists/${listId}/listItems`;

    await createNewListItem(url, reqBody);
});

listItemsBox.addEventListener('click', function (event) {
    clickedTarget = event.target;

    const listItemId = clickedTarget.parentNode.getAttribute('id');

    if (clickedTarget.classList.contains('fa-pen')) {
        createEditModal.setAttribute('list-item-id', listItemId);
        showListAndListItemModal({
            h2: 'Edit List Item',
            label: 'Enter the list Item name:',
            placeholder: 'New List Item Name',
            type: 'EDIT LIST ITEM'
        });
    } else if (clickedTarget.classList.contains('fa-trash')) {
        deleteModal.setAttribute('list-item-id', listItemId);
        showDeleteConfirmationModal({
            p: 'Do you really want to delete this list item?',
            type: 'DELETE LIST ITEM'
        });
    }
});

backBtn.addEventListener('click', () => {
    lists.classList.remove('d-none', 'd-sm-block');
    listItems.classList.add('d-none', 'd-sm-block');
});

modalSubmitBtn.addEventListener('click', async () => {
    const type = modalContainer.getAttribute('type');
    const listName = listNameInput.value.trim();

    const reqBody = JSON.stringify({ name: listName });

    errMsg.textContent = '';

    if (type === 'NEW LIST') {
        const url = `/api/v1/circles/${circleId}/users/${userId}/lists`;
        await createNewList(url, reqBody);
    } else if (type === 'EDIT LIST') {
        const listId = listItems.getAttribute('list-id').slice(3);
        const feedId = listItems.getAttribute('feed-id').slice(3);
        const feedUserId = listItems.getAttribute('feed-user-id').slice(3);
        const url = `/api/v1/circles/${circleId}/users/${feedUserId}/feeds/${feedId}/lists/${listId}`;

        await editList(url, reqBody);
    } else if (type === 'EDIT LIST ITEM') {
        const listId = listItems.getAttribute('list-id').slice(3);
        const feedId = listItems.getAttribute('feed-id').slice(3);
        const feedUserId = listItems.getAttribute('feed-user-id').slice(3);
        const listItemId = createEditModal.getAttribute('list-item-id').slice(3);
        const url = `/api/v1/circles/${circleId}/users/${feedUserId}/feeds/${feedId}/lists/${listId}/listItems/${listItemId}`;

        await editListItem(url, reqBody);
    }
});