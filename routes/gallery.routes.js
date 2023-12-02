const router = require('express').Router();

const { GalleryController } = require('../controllers/gallery.controller');
const { upload } = require('../middlewares/uploads');

const { verifyToken,
    verifyTokenAndAuthorizationForCreator } = require('../middlewares/verifyToken');

router
    .route('/:circleId/users/:userId/photos')
    .post(upload.single('photo') ,verifyTokenAndAuthorizationForCreator, GalleryController.createPhoto)
    .get(verifyToken, GalleryController.getPhotosByUserId);

router
    .route('/:circleId/photos')
    .get(verifyToken, GalleryController.getPhotoByCircleId);

router
    .route('/:circleId/users/:userId/feeds/:feedId/photos/:photoId')
    .get(verifyToken, GalleryController.getPhotoById)
    .put(upload.single('photo'),verifyTokenAndAuthorizationForCreator, GalleryController.updatePhotoById);

module.exports = { router };
