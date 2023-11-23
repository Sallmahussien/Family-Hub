const asyncHandler = require('express-async-handler');

const { PostsDao } = require('../model/dao/post.dao')
const { PostsDto } = require('../model/dto/post.dto')
const { FeedsDto } = require('../model/dto/feed.dto');
const { PostsValidator } = require('../validations/post.validation')


class PostsController {

    /**
     * @desc create a new post
     * @route /api/v1/circles/:circle_id/posts
     * @method POST
     * @access public
     */
    static createPost = asyncHandler(async (req, res) => {

        const feedDto =  new FeedsDto({circleId: req.params.circleId, userId: req.params.userId})

        const postDto = new PostsDto(req.body);
        const error = PostsValidator.createPost(postDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }
        
        const postDao = new PostsDao();
        try {
            const post = await postDao.createPost(postDto, feedDto);
            res.status(201).json(post);
        } catch (err) {
            if (err.message) {
                return res.status(409).json({ message: err.message });
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
        const postDto = new PostsDto(req.body);
        postDto.circleId = req.params.circleId;

        const postDao = new PostsDao();

        try {
            const posts = await postDao.getPostsByCircleId(postDto);
            res.status(200).json(posts);  
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') res.status(404).json({ message: err.message});
            res.status(500).json({ message: 'Internal Server Error' });
        } 
    });

    /**
     * @desc update post by id
     * @route /api/v1/circles/:circle_id/posts/:post_id
     * @method PUT
     * @access public
     */
    static updatePostById = asyncHandler(async (req, res) => {
        const postDto = new PostsDto(req.body);
        postDto.feedId = req.params.feedId;
        postDto.id = req.params.postId;
        const error = PostsValidator.updatePost(postDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }

        const postDao = new PostsDao();
        try {
            await postDao.updatePostById(postDto);
            res.status(201).json({ message: 'Post updated successfully' }); ;
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            } else if (err.code === 'P2025' && err.meta?.cause === 'Record to update not found.') {
                res.status(409).json({ message: 'Post Id is invalid.' });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });
}

module.exports = { PostsController }
