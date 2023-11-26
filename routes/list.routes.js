const express = require('express');

const { ListsController } = require('../controller/list.controller')

const router = express.Router();

router
    .route('/:circleId/users/:userId/lists')
    .post(ListsController.createList);

router
    .route('/:circleId/lists')
    .get(ListsController.getListsByCircleId);

router
    .route('/:circleId/users/:userId/feeds/:feedId/lists/:listId')
    .get(ListsController.getListById)
    .put(ListsController.updateListById);

module.exports = { router };
