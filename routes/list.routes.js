const router = require('express').Router();

const { ListsController } = require('../controllers/list.controller');

const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAuthorizationForCreator } = require('../middlewares/verifyToken');


router
    .route('/:circleId/users/:userId/lists')
    .post(verifyTokenAndAuthorizationForCreator, ListsController.createList);

router
    .route('/:circleId/lists')
    .get(verifyToken, ListsController.getListsByCircleId);

router
    .route('/:circleId/users/:userId/feeds/:feedId/lists/:listId')
    .get(verifyToken, ListsController.getListById)
    .put(verifyTokenAndAuthorization, ListsController.updateListById);

module.exports = { router };
