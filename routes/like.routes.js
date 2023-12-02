const router = require('express').Router();
const { LikesController } = require('../controllers/like.controller');

const { verifyToken,
    verifyTokenAndAuthorizationForCreatorParamFree } = require('../middlewares/verifyToken');

router
    .route('/:circleId/feeds/:feedId/likes')
    .post(verifyTokenAndAuthorizationForCreatorParamFree, LikesController.createLike)
    .get(verifyToken, LikesController.getLikesByFeedId)
    .delete(verifyTokenAndAuthorizationForCreatorParamFree, LikesController.deleteLikeById);

module.exports = { router };
