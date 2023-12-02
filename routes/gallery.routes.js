const router = require('express').Router();

const { GalleryController } = require('../controllers/gallery.controller');

const { verifyToken,
    verifyTokenAndAuthorizationForCreator } = require('../middlewares/verifyToken');

router
    .route('/:circleId/users/:userId/photos')
    .post(verifyTokenAndAuthorizationForCreator, GalleryController.createPhoto)
    .get(verifyToken, GalleryController.getPhotosByUserId);

router
    .route('/:circleId/photos')
    .get(verifyToken, GalleryController.getPhotoByCircleId);

router
    .route('/:circleId/users/:userId/feeds/:feedId/photos/:photoId')
    .get(verifyToken, GalleryController.getPhotoById)
    .put(verifyTokenAndAuthorizationForCreator, GalleryController.updatePhotoById);

module.exports = { router };
