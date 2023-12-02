const router = require('express').Router();

const { ContactBooksController } = require('../controllers/contactBook.controller');

const { verifyToken } = require('../middlewares/verifyToken');

const { upload } = require('../middlewares/uploads');

router
    .route('/:circleId/contactbooks/')
    .get(verifyToken, ContactBooksController.getContactsByCircleId)
    .post(upload.single('profilePhoto'), verifyToken, ContactBooksController.createContact);


router
    .route('/:circleId/contactbooks/:contactId')
    .get(verifyToken, ContactBooksController.getContactById)
    .put(upload.single('profilePhoto'), verifyToken, ContactBooksController.updateContactById)
    .delete(verifyToken, ContactBooksController.deleteContactById);

module.exports = { router }
