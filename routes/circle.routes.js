const express = require('express');

 const { CircleController } = require('../controller/circle.controller');

 const router = express.Router();

 router.route('/')
    .post(CircleController.createCircle);

router.route('/:circleId')
    .get(CircleController.getCirleById)
    .put(CircleController.updateCircle)
    .delete(CircleController.deleteCircleById);

 module.exports = { router };