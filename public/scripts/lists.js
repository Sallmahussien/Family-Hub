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

let clickedTarget;

addListBtn.addEventListener('click', () => {
    showListAndListItemModal({
        h2: 'Create a new list',
        label: 'Enter the list name:',
        placeholder: 'List Name',
        type: 'NEW LIST'
    });
});

function showListAndListItemModal(modalConfig) {
    const setElementText = (element, text) => (element.textContent = text || '');

    setElementText(document.getElementById('modalTitle'), modalConfig.h2);
    setElementText(document.getElementById('labelListName'), modalConfig.label);
    listNameInput.placeholder = modalConfig.placeholder || '';
    modalContainer.setAttribute('type', modalConfig.type);

    createEditModal.style.display = 'flex';
    modalContainer.style.display = 'flex';
    errMsg.style.display = 'none';
}

addClickedToFirstListBox();

function addClickedToFirstListBox() {
    const listBoxes = document.querySelectorAll('.list-box');

    if (listBoxes.length > 0) {
        listBoxes[0].classList.add('clicked');
        writeListNameToListItemsSection(listBoxes[0].getAttribute('id'));
    }
}

function handleListBoxClick(clickedBox) {
    const listBoxes = document.querySelectorAll('.list-box');
    listBoxes.forEach(box => box.classList.remove('clicked'));
    clickedBox.classList.add('clicked');

    listItems.classList.remove('d-none', 'd-sm-block');
    lists.classList.add('d-none', 'd-sm-block');

    writeListNameToListItemsSection(clickedBox.getAttribute('id'));
}

function writeListNameToListItemsSection(clickedId) {
    const listNameFromClicked = document.querySelector(`#${clickedId} .text p`);


    listItems.setAttribute('list-id', clickedId);
    listNameToListItems.textContent = listNameFromClicked.textContent;
}

modalSubmitBtn.addEventListener('click', () => {
    const listName = listNameInput.value.trim();

    if (listName !== '') {
        if (modalContainer.getAttribute('type') === 'NEW LIST') {
            createNewList(listName);
        } else if (modalContainer.getAttribute('type') === 'EDIT LIST') {
            editListName(listName);
        } else if (modalContainer.getAttribute('type') === 'EDIT LIST ITEM') {
            editListItemName(listName, clickedTarget);
        }

        hideListAndListItemModal();
    } else {
        errMsg.style.display = 'block';
    }
});

function createNewList(listName) {
    const newListContainer = document.createElement('div');
    const listId = 'id' + Math.random().toString(36).substr(2, 10);

    newListContainer.classList.add('list-box', 'd-flex', 'align-items-center', 'justify-content-between');
    newListContainer.setAttribute('onclick', 'handleListBoxClick(this)');
    newListContainer.setAttribute('id', listId);

    newListContainer.innerHTML = `
        <i class="fas fa-list"></i>
        <div class="text">
            <p>${listName}</p>
            <span>Shared With All Members</span>
        </div>
        <span class="list-items-num">0</span>
    `;

    listsContainer.appendChild(newListContainer);
}

function editListName(listName) {
    const listNameToBeEdited = document.querySelector(`#${getListBoxId()} .text p`);

    listNameToBeEdited.textContent = listName;
    listNameToListItems.textContent = listName;
}

function editListItemName(listItemName, clickedIcon) {
    const listItemContainer = clickedIcon.parentNode;
    const listItem = document.querySelector(`#${listItemContainer.getAttribute('id')} label`);

    listItem.textContent = listItemName;
}

function getListBoxId() {
    const listBoxId = listItems.getAttribute('list-id');

    return listBoxId;
}

function hideListAndListItemModal() {
    listNameInput.value = '';
    createEditModal.style.display = 'none';
    modalContainer.style.display = 'none';
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

function showDeleteConfirmationModal(deleteConfig) {
    const msg = getElement('deleteMsg');
    msg.innerHTML = deleteConfig.p;

    modalContainer.setAttribute('type', deleteConfig.type);

    modalContainer.style.display = 'flex';
    deleteModal.style.display = 'flex'
}

confirmDelete.addEventListener('click', () => {
    if (modalContainer.getAttribute('type') === 'DELETE LIST') {
        const listBoxToBeDeleted = getElement(getListBoxId());
        listsContainer.removeChild(listBoxToBeDeleted);
        addClickedToFirstListBox();
    } else if (modalContainer.getAttribute('type') === 'DELETE LIST ITEM'){
        const listItemToBeDeleted = clickedTarget.parentNode;
        listItemsBox.removeChild(listItemToBeDeleted);
    }

    hideDeleteConfirmationModal();
    
});

cancelDelete.addEventListener('click', () => {
    hideDeleteConfirmationModal();
});

function hideDeleteConfirmationModal() {
    modalContainer.style.display = 'none';
    deleteModal.style.display = 'none'
}

listForm.addEventListener('submit', (event) => {
    event.preventDefault();
    listItemErrMsg.style.display = 'none';

    const listItem = listItemInput.value.trim();

    if (listItem !== '') {
        createListItem(listItem);
        listItemInput.value = '';
    } else {
        listItemErrMsg.style.display = 'block';
    }
});

function createListItem(listItem) {
    const listItemBox = document.createElement('div');
    const listItemId = 'id' + Math.random().toString(36).substr(2, 10);

    listItemBox.classList.add('list-item', 'd-flex', 'align-items-center', 'gap-2');
    listItemBox.setAttribute('id', listItemId);
    listItemBox.innerHTML = `
        <input type="checkbox" id="list-item-1">
        <label for="list-item-1" class="flex-grow-1">${listItem}</label>
        <i class="fa-solid fa-pen"></i>
        <i class="fa-solid fa-trash"></i>
    `;

    freeList.style.display = 'none';
    listItemsBox.appendChild(listItemBox);
}

const listItemsBoxChildren = listItemsBox.children;

if (listItemsBoxChildren.length === 0) {
    freeList.style.display = 'flex';
}

listItemsBox.addEventListener('click', function (event) {
    clickedTarget = event.target;

    if (clickedTarget.classList.contains('fa-pen')) {
        showListAndListItemModal({
            h2: 'Edit List Item',
            label: 'Enter the list Item name:',
            placeholder: 'New List Item Name',
            type: 'EDIT LIST ITEM'
        });
    } else if (clickedTarget.classList.contains('fa-trash')) {
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