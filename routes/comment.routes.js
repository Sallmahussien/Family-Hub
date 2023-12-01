const router = require('express').Router();

const { CommentsController } = require('../controllers/comment.controller')



router
    .route('/:circleId/feeds/:feedId/comments/')
    .post(CommentsController.createComment)
    .get(CommentsController.getCommentsByFeedId);

router
    .route('/:circleId/feeds/:feedId/comments/:commentId/')
    .put(CommentsController.updateCommentById)
    .delete(CommentsController.deleteCommentById)


module.exports = { router };
