const router = require('express').Router();

const { ContactBooksController } = require('../controller/contactBook.controller');

router.route('/:circleId/contactbooks/')
.get(ContactBooksController.getContactsByCircleId)
.post(ContactBooksController.createContact);


router.route('/:circleId/contactbooks/:contactId')
.get(ContactBooksController.getContactById)
.put(ContactBooksController.updateContactById)
.delete(ContactBooksController.deleteContactById);

module.exports = { router } 