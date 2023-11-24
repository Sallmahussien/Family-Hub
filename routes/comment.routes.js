const router = require('express').Router();

const { CommentsController } = require('../controller/comment.controller')



router
    .route('/feeds/:feedId/users/:userId/comments/')
    .post(CommentsController.createComment);


router
    .route('/feeds/:feedId/comments/')
    .get(CommentsController.getCommentsByFeedId)


router
    .route('/feeds/:feedId/users/:userId/comments/:commentId')
    .put(CommentsController.updateCommentById)
    .delete(CommentsController.deleteCommentById)


module.exports = { router };
