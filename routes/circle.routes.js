const router = require('express').Router();

const { verifyTokenAndAdmin, verifyToken } = require('../middlewares/verifyToken');

const { CircleController } = require('../controllers/circle.controller');

const { upload } = require('../middlewares/uploads');


router
    .route('/')
    .post(upload.single('coverPhoto'), CircleController.createCircle);

    router
    .route('/:circleId')
    .get(verifyToken, CircleController.getCirleById)
    .put(upload.single('coverPhoto'), verifyTokenAndAdmin, CircleController.updateCircle)
    .delete(verifyTokenAndAdmin, CircleController.deleteCircleById);

module.exports = { router };
