const router = require('express').Router();
const { LikesController } = require('../controller/like.controller')

router
    .route('/feeds/:feedId/users/:userId/likes/')
    .post(LikesController.createLike);


router
    .route('/feeds/:feedId/likes/')
    .get(LikesController.getLikesByFeedId)


router
    .route('/feeds/:feedId/users/:userId/likes/:likeId')
    .delete(LikesController.deleteLikeById)


module.exports = { router };