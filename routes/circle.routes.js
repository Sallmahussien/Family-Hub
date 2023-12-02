const router = require('express').Router();

const { verifyTokenAndAdmin, verifyToken } = require('../middlewares/verifyToken');

const { CircleController } = require('../controllers/circle.controller');


 router
    .route('/')
    .post(CircleController.createCircle);

router
    .route('/:circleId')
    .get(verifyToken, CircleController.getCirleById)
    .put(verifyTokenAndAdmin, CircleController.updateCircle)
    .delete(verifyTokenAndAdmin, CircleController.deleteCircleById);

module.exports = { router };
