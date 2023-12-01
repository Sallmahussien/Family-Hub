const express = require('express');

const { UsersController } = require('../controllers/user.controller');

const router = express.Router();


router
    .route('/:circleId/users/')
    .get(UsersController.getUsersByCircleId)
    .post(UsersController.createUser);


router
    .route('/:circleId/users/:userId/')
    .get(UsersController.getUsersById)
    .put(UsersController.updateUserById)
    .delete(UsersController.deleteUserById);


module.exports = { router };
