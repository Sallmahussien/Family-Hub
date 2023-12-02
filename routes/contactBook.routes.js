const router = require('express').Router();

const { ContactBooksController } = require('../controllers/contactBook.controller');

const { verifyToken } = require('../middlewares/verifyToken');

router
    .route('/:circleId/contactbooks/')
    .get(verifyToken, ContactBooksController.getContactsByCircleId)
    .post(verifyToken, ContactBooksController.createContact);


router
    .route('/:circleId/contactbooks/:contactId')
    .get(verifyToken, ContactBooksController.getContactById)
    .put(verifyToken, ContactBooksController.updateContactById)
    .delete(verifyToken, ContactBooksController.deleteContactById);

module.exports = { router }
