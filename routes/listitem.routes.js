const express = require('express');

const { ListItemsController } = require('../controller/listitem.controller')

const router = express.Router();

router
    .route('/:circleId/users/:userId/feeds/:feedId/lists/:listId/listItems')
    .post(ListItemsController.createListItem)
    .get(ListItemsController.getListItemsByListId);

router
    .route('/:circleId/users/:userId/feeds/:feedId/lists/:listId/listItems/:listItemId')
    .put(ListItemsController.updateListItemById)
    .delete(ListItemsController.deleteListItemById);

module.exports = { router };
