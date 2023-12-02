const router = require('express').Router();

const { ListItemsController } = require('../controllers/listitem.controller');

const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAuthorizationForCreator } = require('../middlewares/verifyToken');


router
    .route('/:circleId/users/:userId/feeds/:feedId/lists/:listId/listItems')
    .post(verifyTokenAndAuthorizationForCreator, ListItemsController.createListItem)
    .get(verifyToken, ListItemsController.getListItemsByListId);

router
    .route('/:circleId/users/:userId/feeds/:feedId/lists/:listId/listItems/:listItemId')
    .put(verifyTokenAndAuthorizationForCreator, ListItemsController.updateListItemById)
    .delete(verifyTokenAndAuthorization, ListItemsController.deleteListItemById);

module.exports = { router };
