const router = require('express').Router();

const { FeedsController } = require('../controllers/feed.controller');

const { verifyToken,
    verifyTokenAndAuthorization } = require('../middlewares/verifyToken');


router
    .route('/:circleId/feeds/')
    .get(verifyToken, FeedsController.getFeedsByCircleId);

router
    .route('/:circleId/users/:userId/feeds/:feedId')
    .get(verifyToken, FeedsController.getFeedById)
    .delete(verifyTokenAndAuthorization, FeedsController.deleteFeedById);

module.exports = { router }
