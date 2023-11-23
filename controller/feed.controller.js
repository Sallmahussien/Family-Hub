const asyncHandler = require('express-async-handler');

const { FeedsDao } = require('../model/dao/feed.dao');
const { FeedsDto } = require('../model/dto/feed.dto');


class FeedsController {
    /**
     * @desc get feeds by circleId
     * @route /api/v1/circles/:circle_id/feeds/
     * @method GET
     * @access public
     */

    static getFeedsByCircleId = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto(req.body);
        feedDto.circleId = req.params.circleId;

        const feedDao = new FeedsDao();

        try {
            const feeds = await feedDao.getFeedsByCircleId(feedDto);
            res.status(200).json(feeds);  
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') res.status(404).json({ message: err.message});
            res.status(500).json({ message: 'Internal Server Error' });
        } 
    });

    /**
     * @desc get feed by Id
     * @route /api/v1/circles/:circle_id/feeds/:feedId
     * @method GET
     * @access public
     */

    static getFeedById = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto(req.body);
        feedDto.circleId = req.params.circleId;
        feedDto.id = req.params.feedId;
    
        const feedDao = new FeedsDao();
        try {
            const feed = await feedDao.getFeedById(feedDto);
            if (!feed) res.status(400).json({ message: 'Feed Id is invalid.'});
            res.status(200).json(feed);
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                return res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });

    /**
     * @desc delete feed by Id
     * @route /api/v1/circles/:circle_id/feeds/:feedId
     * @method DELETE
     * @access public
     */
    static deleteFeedById = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto(req.body);
        feedDto.circleId = req.params.circleId;
        feedDto.id = req.params.feedId;
    
        const feedDao = new FeedsDao();
        try {
            await feedDao.deleteFeedById(feedDto);
            res.status(201).json({ message: 'Feed deleted successfully' }); ;
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            } else if (err.code === 'P2025' && err.meta?.cause === 'Record to update not found.') {
                res.status(409).json({ message: 'Feed Id is invalid.' });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });

}

module.exports = { FeedsController }