const asyncHandler = require('express-async-handler');

const { PostsDao } = require('../models/dao/post.dao')
const { PostsDto } = require('../models/dto/post.dto')
const { FeedsDto } = require('../models/dto/feed.dto');
const { PostsValidator } = require('../validations/post.validation')


class PostsController {

    /**
     * @desc create a new post
     * @route /api/v1/circles/:circle_id/users/:userId/posts
     * @method POST
     * @access public
     */
    static createPost = asyncHandler(async (req, res) => {

        const feedDto =  new FeedsDto({circleId: req.params.circleId, userId: req.params.userId})

        const postDto = new PostsDto(req.body);
        const error = PostsValidator.createPost(postDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }
        
        const postDao = new PostsDao();
        try {
            const post = await postDao.createPost(postDto, feedDto);
            res.status(201).json(post);
        } catch (err) {
            const prefixes = ['Circle', 'User'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    /**
     * @desc get all posts by circle id
     * @route /api/v1/circles/:circleId/posts/
     * @method GET
     * @access public
     */
    static getPostsByCircleId = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto(req.body);
        feedDto.circleId = req.params.circleId;

        const postDao = new PostsDao();

        try {
            const posts = await postDao.getPostsByCircleId(feedDto);
            res.status(200).json(posts);  
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') res.status(404).json({ message: err.message});
            res.status(500).json({ message: 'Internal Server Error' });
        } 
    });

    /**
     * @desc update post by id
     * @route /api/v1/circles/:circleId/users/:userId/feeds/:feedId/posts/:postId
     * @method PUT
     * @access public
     */
    static updatePostById = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto({ 
            id: req.params.feedId,
            circleId: req.params.circleId,
            userId: req.params.userId,
        });

        const postDto = new PostsDto(req.body);
        postDto.feedId = req.params.feedId;
        postDto.id = req.params.postId;

        const error = PostsValidator.updatePost(postDto);
        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }

        const postDao = new PostsDao();
        try {
            await postDao.updatePostById(postDto, feedDto);
            res.status(200).json({ message: 'Post updated successfully' }); ;
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'Post'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });
}

module.exports = { PostsController }
