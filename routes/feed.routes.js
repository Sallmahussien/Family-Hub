const express = require('express');

const { FeedsController } = require('../controller/feed.controller')

const router = express.Router()

router.route('/:circleId/feeds/').get(FeedsController.getFeedsByCircleId);
router
    .route('/:circleId/users/:userId/feeds/:feedId')
    .get(FeedsController.getFeedById)
    .delete(FeedsController.deleteFeedById);

module.exports = { router }
