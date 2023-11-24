const express = require('express');

const { GalleryController } = require('../controller/gallery.controller');

const router = express.Router();

router.route('/:circleId/users/:userId/photos')
    .post(GalleryController.createPhoto)
    .get(GalleryController.getPhotosByUserId);

router.route('/:circleId/photos')
    .get(GalleryController.getPhotoByCircleId);

router.route('/:circleId/users/:userId/feeds/:feedId/photos/:photoId')
    .get(GalleryController.getPhotoById)
    .put(GalleryController.updatePhotoById);

module.exports = { router };