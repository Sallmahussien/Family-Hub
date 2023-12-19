const getElement = (id) => document.getElementById(id);
const modalContainer = getElement('modalContainer');
const createEditModal = getElement('createEditModal');
const deleteConfirmationModal = getElement('deleteModal');

const editDeleteModal = document.querySelector('.edit-delete-modal');
const modalTitle = document.querySelector('#createEditModal h2');

const contactBookContainer = document.querySelector('.contacts-book');
const selectorsContainers = document.querySelector('.contacts');
const contactBookDtails = document.querySelector('.contact-book-details');
const freemainContactBookDetails = document.querySelector('.free-contact-book');
const mainContactBookDetails = document.querySelector('.main-contact-book-details');

const url = `/api/v1/circles/${circleId}/contactbooks`;

const modalElements = {
    firstName: getElement('firstName'),
    lastName: getElement('lastName'),
    phoneNumber: getElement('phoneNumber'),
    email: getElement('email'),
    type: getElement('type'),
    profilePhoto: getElement('profilePhoto'),
    note: getElement('note'),
}

getAllContacts(url);


// HTTP methods
async function getAllContacts(url) {
    try {
        const response = await fetch(url);
        const responseData = await response.json();

        if (response.status === 200) {
            await handleContactsDataFromGetMethod(responseData);
        }
    } catch (err) {
        console.log(err);
    }
}

async function getContactById(url) {
    try {
        const response = await fetch(url);

        if (response.status === 200) {
            return await response.json();
        }

    } catch (error) {
        console.error(error);
    }
}

async function createNewContact(url, bodyReq) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: bodyReq,
        });

        const responseData = await response.json();

        if (response.status === 201) {
            location.reload();
        } else if (response.status === 400) {
            handleDisplayingErr(responseData);
        }
    } catch (err) {
        console.log(err);
    }
}

async function editContactBook(url, bodyReq) {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: bodyReq,
        });

        const responseData = await response.json();

        if (response.status === 200) {
            location.reload();
        } else if (response.status === 400) {
            handleDisplayingErr(responseData);
        }
    } catch (err) {
        console.log(err);
    }
}

async function deleteContactBook (url) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });

        const responseData = await response.json();

        if (response.status === 200) {
            location.reload();
        } else if (response.status === 400) {
            handleDisplayingErr(responseData);
        }
    } catch (err) {
        console.log(err);
    }
}

// logic functions
async function handleContactsDataFromGetMethod(data) {
    handleDisplayContactDetails(data);
    createContactsSelectors(data);
    const firstSelectorId = AddClickedClassForSelector();
    if (firstSelectorId) await linkSelectorWithContactDetails(firstSelectorId);
}

function handleDisplayContactDetails(data) {
    if (data.length === 0) {
        freemainContactBookDetails.style.display = 'flex';
        mainContactBookDetails.style.display = 'none';
    } else {
        freemainContactBookDetails.style.display = 'none';
        mainContactBookDetails.style.display = 'block';
    }
}

function createContactsSelectors(data) {
    data.forEach(contactObj => {
        const profilePhoto = contactObj.profilePhoto ? `/images/${contactObj.profilePhoto}` : '/imgs/user.jpg';

        const contactSelector = document.createElement('div');
        contactSelector.classList.add('contact-selector', 'd-flex', 'align-items-center', 'gap-3', 'p-2');
        contactSelector.setAttribute('id', `id-${contactObj.id}`);
        contactSelector.setAttribute('onclick', 'handleClickContactSelector(this)');
        contactSelector.innerHTML = `
            <img src="${profilePhoto}" alt="">
            <div class="name flex-grow-1 ">
                <p>${contactObj.firstName}</p>
                <span>${contactObj.type ? contactObj.type : ''}</span>
            </div>
        `;

        selectorsContainers.appendChild(contactSelector);
    });
}

function AddClickedClassForSelector() {
    const firstSelector = selectorsContainers.firstElementChild;

    if (firstSelector) {
        firstSelector.classList.add('clicked');

        return firstSelector.getAttribute('id');
    }
}

async function linkSelectorWithContactDetails(selectorId) {
    const mainContactBookDetails = document.querySelector('.contact-book-details');
    const fullNameContainer = mainContactBookDetails.querySelector('.main-header h2');
    const jobContainer = mainContactBookDetails.querySelector('.main-header span');
    const image = mainContactBookDetails.querySelector('.contact-image img');
    const email = mainContactBookDetails.querySelector('.contact-details .email');
    const emailContainer = mainContactBookDetails.querySelector('.contact-details .email h3');
    const phoneNumberContainer = mainContactBookDetails.querySelector('.contact-details .phone-num h3');
    const note = mainContactBookDetails.querySelector('.note textarea');

    const url = `/api/v1/circles/${circleId}/contactbooks/${selectorId.slice(3)}`

    const contactBook = await getContactById(url);

    mainContactBookDetails.setAttribute('contact-id', selectorId);

    fullNameContainer.textContent = `${contactBook.firstName} ${contactBook.lastName}`;
    jobContainer.textContent = contactBook.type || '';
    image.src = contactBook.profilePhoto ? `/images/${contactBook.profilePhoto}` : '/imgs/user.jpg';

    if (contactBook.email) {
        email.style.display = 'flex';
        emailContainer.textContent = contactBook.email;
    } else {
        email.style.display = 'none';
    }

    phoneNumberContainer.textContent = contactBook.phoneNumber;
    note.textContent = contactBook.note || '';
}

function handleDisplayingErr(data) {
    for (const key in modalElements) {
        const inputElement = modalElements[key];

        if (data.message.startsWith(`"${key}"`)) {
            const spanToDisplayErr = inputElement.nextElementSibling;
            if (spanToDisplayErr) {
                spanToDisplayErr.textContent = data.message;
                break;
            }
        }
    }
}

function clearSpanText() {
    const spanElements = document.querySelectorAll('.formOption span');
    spanElements.forEach(spanElement => {
        spanElement.textContent = '';
    });
}

function createFormData() {
    const formElement = document.querySelector('#createEditModal form');

    const formData = new FormData(formElement);

    const entriesToBeDeleted = [];

    formData.forEach((value, key) => {
        if (value === '') {
            entriesToBeDeleted.push(key)
        }
    });

    entriesToBeDeleted.forEach(entry => {
        formData.delete(entry);
    });

    return formData
}

// show and hiding modal
function showModal(type, title) {
    modalContainer.style.display = 'flex';

    if (type === 'CREATE' || type === 'EDIT') {
        modalTitle.textContent = title;
        createEditModal.style.display = 'flex';
        createEditModal.setAttribute('type', type);
        deleteConfirmationModal.style.display = 'none';
    } else if (type === 'DELETE') {
        createEditModal.style.display = 'none';
        deleteConfirmationModal.style.display = 'flex';
    }
}

function hideModal() {
    createEditModal.style.display = 'none';
    deleteConfirmationModal.style.display = 'none';
    modalContainer.style.display = 'none';
}

function hideDeleteEditModal() {
    editDeleteModal.style.display = 'none';
    document.removeEventListener('click', closeEditDeleteModalOutside);
}

function closeEditDeleteModalOutside(event) {
    const editDeleteContainer = document.querySelector('.edit-delete-modal .modal-content');
    if (!editDeleteContainer.contains(event.target)) {
        hideDeleteEditModal();
    }
}

// onclick functions
function createNewContactModal() {
    const title = 'Create a new contact book';
    showModal('CREATE', title)
}

function handleBack() {
    contactBookDtails.classList.add('d-none', 'd-sm-block');
    contactBookContainer.classList.remove('d-none', 'd-sm-block');
}

function handleClickContactSelector(clickedBox) {
    const contactBoxes = document.querySelectorAll('.contact-selector');
    contactBoxes.forEach(box => box.classList.remove('clicked'));
    clickedBox.classList.add('clicked');

    contactBookDtails.classList.remove('d-none', 'd-sm-block');
    contactBookContainer.classList.add('d-none', 'd-sm-block');

    linkSelectorWithContactDetails(clickedBox.getAttribute('id'));
}

function showEditDeleteModal() {
    editDeleteModal.style.display = 'flex';
    setTimeout(function () {
        document.addEventListener('click', closeEditDeleteModalOutside);
    }, 0);
}

function showEditModal() {
    hideDeleteEditModal();

    const title = 'Edit a Contact Book';
    showModal('EDIT', title);
}

function showDeleteModal() {
    hideDeleteEditModal();

    showModal('DELETE');
}

async function handleSubmitBtn() {
    const type = createEditModal.getAttribute('type');

    const formData = createFormData();

    clearSpanText();

    if (type === 'CREATE') {
        await createNewContact(url, formData);
    } else if (type === 'EDIT') {
        const contactId = contactBookDtails.getAttribute('contact-id').slice(3);
        const url = `/api/v1/circles/${circleId}/contactbooks/${contactId}`;

        await editContactBook(url, formData);
    }
}

async function confirmDelete () {
    const contactId = contactBookDtails.getAttribute('contact-id').slice(3);
    const url = `/api/v1/circles/${circleId}/contactbooks/${contactId}`;

    await deleteContactBook(url);
}

function cancelDelete() {
    hideModal();
}

function closeModal() {
    hideModal();
}