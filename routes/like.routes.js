const router = require('express').Router();
const { LikesController } = require('../controller/like.controller')

router
    .route('/:circleId/users/:userId/feeds/:feedId/likes')
    .post(LikesController.createLike)
    .get(LikesController.getLikesByFeedId)
    .delete(LikesController.deleteLikeById);

module.exports = { router };