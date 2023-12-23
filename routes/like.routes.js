const router = require('express').Router();
const { LikesController } = require('../controllers/like.controller');

const { verifyToken } = require('../middlewares/verifyToken');

router
    .route('/:circleId/feeds/:feedId/likes')
    .post(verifyToken, LikesController.createLike)
    .get(verifyToken, LikesController.getLikesByFeedId)
    .delete(verifyToken, LikesController.deleteLikeById);

module.exports = { router };