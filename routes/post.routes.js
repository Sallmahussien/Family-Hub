const router = require('express').Router();

const { PostsController } = require('../controllers/post.controller')

const { verifyToken,
    verifyTokenAndAuthorizationForCreator } = require('../middlewares/verifyToken');

router
    .route('/:circleId/users/:userId/posts/')
    .post(verifyTokenAndAuthorizationForCreator, PostsController.createPost);

router
    .route('/:circleId/posts/')
    .get(verifyToken, PostsController.getPostsByCircleId)

router
    .route('/:circleId/users/:userId/feeds/:feedId/posts/:postId')
    .put(verifyTokenAndAuthorizationForCreator, PostsController.updatePostById)


module.exports = { router }
