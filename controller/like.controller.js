const asyncHandler = require('express-async-handler');
const { LikesDao } = require('../model/dao/like.dao');
const { LikesDto } = require('../model/dto/like.dto');
const { FeedsDto } = require('../model/dto/feed.dto');
const { LikesValidator } = require('../validations/like.validation');

class LikesController {

    /**
     * @desc create a new like
     * @route /api/v1/circles/feeds/:feedId/users/:userId/likes/
     * @method POST
     * @access public
     */
    static createLike = asyncHandler(async (req, res) => {
        const likeDto = new LikesDto(req.body);
        likeDto.feedId = req.params.feedId;
        likeDto.userId = req.params.userId;

        const error = LikesValidator.createLike(likeDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }
        
        const likeDao = new LikesDao();
        try {
            const like = await likeDao.createLike(likeDto);
            if (!like) res.status(201).json(like);
            res.status(201).json(like);
        } catch (err) {
            console.log(err)
            const prefixes = ['User', 'Feed', 'Like'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
                res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });


    /**
     * @desc get likes by feedId id
     * @route /api/v1/circles/feeds/:feedId/likes/
     * @method GET
     * @access public
     */
    static getLikesByFeedId = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto(req.body);
        feedDto.id = req.params.feedId;

        const likeDao = new LikesDao();

        try {
            const likes = await likeDao.getLikesByFeedId(feedDto);
            res.status(200).json(likes);  
        } catch (err) {
            if (err.message === 'Feed Id is invalid.') res.status(404).json({ message: err.message});

            res.status(500).json({ message: 'Internal Server Error' });
        } 
    });

    /**
     * @desc delete like by id
     * @route /api/v1/circles//feeds/:feedId/users/:userId/likes/:likeId
     * @method DELETE
     * @access public
     */
    static deleteLikeById = asyncHandler(async (req, res) => {
        const likeDto = new LikesDto(req.body);
        likeDto.id = req.params.likeId;
        likeDto.feedId = req.params.feedId;
        likeDto.userId = req.params.userId;

        const likeDao = new LikesDao();
        try {
            await likeDao.deleteLikeById(likeDto);
            res.status(201).json({ message: 'Like deleted successfully' }); ;
        } catch (err) {
            if (err.message === 'Like Id is invalid.') {
                res.status(409).json({ message: err.message });
            } else if (err.code === 'P2025' && err.meta?.cause === 'Record to update not found.') {
                res.status(409).json({ message: 'Like Id is invalid.' });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });
}

module.exports = { LikesController }