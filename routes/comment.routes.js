const router = require('express').Router();

const { CommentsController } = require('../controllers/comment.controller')
const { verifyToken,
    verifyTokenAndAuthorizationParamsFree,
    verifyTokenAndAuthorizationForCreatorParamFree } = require('../middlewares/verifyToken');


router
    .route('/:circleId/feeds/:feedId/comments/')
    .post(verifyToken, CommentsController.createComment)
    .get(verifyToken, CommentsController.getCommentsByFeedId);

router
    .route('/:circleId/feeds/:feedId/comments/:commentId/')
    .put(verifyTokenAndAuthorizationForCreatorParamFree, CommentsController.updateCommentById)
    .delete(verifyTokenAndAuthorizationParamsFree, CommentsController.deleteCommentById)


module.exports = { router };
