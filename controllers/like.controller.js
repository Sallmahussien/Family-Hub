const asyncHandler = require('express-async-handler');
const { LikesDao } = require('../models/dao/like.dao');
const { LikesDto } = require('../models/dto/like.dto');
const { FeedsDto } = require('../models/dto/feed.dto');
const { LikesValidator } = require('../validations/like.validation');

class LikesController {

    /**
     * @desc create a new like
     * @route /api/v1/circles/:circleId/users/:userId/feeds/:feedId/likes/
     * @method POST
     * @access public
    */
    static createLike = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto({
            id: req.params.feedId,
            circleId: req.params.circleId,
        });

        const likeDto = new LikesDto(req.body);
        likeDto.feedId = req.params.feedId;

        const error = LikesValidator.createLike(likeDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }
        
        const likeDao = new LikesDao();
        try {
            const like = await likeDao.createLike(likeDto, feedDto);
            if (!like) res.status(201).json(like);
            res.status(201).json(like);
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'Like'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
                res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });


    /**
     * @desc get likes by feedId id
     * @route /api/v1/circles/:circleId/users/userId/feeds/:feedId/likes/
     * @method GET
     * @access public
    */
    static getLikesByFeedId = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto({
            id: req.params.feedId,
            circleId: req.params.circleId,
        });

        const likeDto = new LikesDto(req.body);
        likeDto.feedId = req.params.feedId;

        const likeDao = new LikesDao();

        try {
            const likes = await likeDao.getLikesByFeedId(feedDto, likeDto);
            res.status(200).json(likes);  
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
                res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error.' });
        } 
    });

    /**
     * @desc delete like by id
     * @route /api/v1/circles/:circleId/users/:userId/feeds/:feedId/likes/:likeId
     * @method DELETE
     * @access public
    */
    static deleteLikeById = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto({
            id: req.params.feedId,
            circleId: req.params.circleId,
        });

        const likeDto = new LikesDto(req.body);
        likeDto.feedId = req.params.feedId;

        const likeDao = new LikesDao();
        try {
            await likeDao.deleteLikeById(feedDto, likeDto);
            res.status(201).json({ message: 'Like deleted successfully' });
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'Like'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
                res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error.' });
        }
    });
}

module.exports = { LikesController }