const express = require('express');

const { PostsController } = require('../controllers/post.controller')

const router = express.Router()

router
    .route('/:circleId/users/:userId/posts/')
    .post(PostsController.createPost);

router
    .route('/:circleId/posts/')
    .get(PostsController.getPostsByCircleId)

router
    .route('/:circleId/users/:userId/feeds/:feedId/posts/:postId')
    .put(PostsController.updatePostById)


module.exports = { router }
