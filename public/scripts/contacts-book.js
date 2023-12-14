// document.addEventListener("DOMContentLoaded", function () {
//     function openForm() {
//         var modal = document.getElementById('AddContact');
//         modal.style.visibility = 'visible';
//     }

//     function closeForm() {
//         var modal = document.getElementById('AddContact');
//         modal.style.visibility = 'hidden';
//     }

//     window.openForm = openForm;
//     window.closeForm = closeForm;

//     document.addEventListener('click', function (event) {
//         var contactSelector = event.target.closest('.contact-selector');
//         if (contactSelector) {
//             var rightSection = document.querySelector('.right');
//             rightSection.style.display = (rightSection.style.display === 'flex') ? 'none' : 'flex';
//         }
//     });
// });

const getElement = (id) => document.getElementById(id);
const modalContainer = getElement('modalContainer');
const createEditModal = getElement('createEditModal');
const createNewContactBtn = getElement('createNewContact')

console.log(modalContainer);
console.log(createEditModal)

createNewContactBtn.addEventListener('click', () => {
    console.log('clicked');
    createEditModal.style.display = 'flex';
    modalContainer.style.display = 'flex';
});


function hideListAndListItemModal() {
    createEditModal.style.display = 'none';
    modalContainer.style.display = 'none';
}

function closeModal() {
    hideListAndListItemModal();
}