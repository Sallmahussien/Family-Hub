const asyncHandler = require('express-async-handler');

const { GalleryDao } = require('../models/dao/gallery.dao');
const { GalleryDto } = require('../models/dto/gallery.dto');
const { FeedsDto } = require('../models/dto/feed.dto');
const { GalleryValidator } = require('../validations/gallery.validation');

class GalleryController {

    /**
     * @desc create a new photo
     * @route /api/v1/circles/:circleId/users/:userId/photos
     * @method POST
     * @access public
     */
    static createPhoto = asyncHandler(async (req, res) => {

        const feedDto =  new FeedsDto({
            circleId: req.params.circleId, 
            userId: req.params.userId
        });

        const photoDto = new GalleryDto(req.body);

        const error = GalleryValidator.createGallery(photoDto);
        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }

        const photoDao = new GalleryDao();
        try {
            const photo = await photoDao.createPhoto(photoDto, feedDto);
            res.status(201).json(photo);
        } catch (err) {
            const prefixes = ['Circle', 'User'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
        }
    });

    /**
     * @desc get photos by CircleId
     * @route /api/v1/circles/:circleId/photos
     * @method GET
     * @access public
     */
    static getPhotoByCircleId = asyncHandler(async (req, res) => {
        const feedDto =  new FeedsDto({
            circleId: req.params.circleId
        });

        const photoDao = new GalleryDao();
        try {
            const photos = await photoDao.getPhotoByCircleId(feedDto);
            res.status(201).json(photos);
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
        }
    });

    /**
     * @desc get photos by UserId
     * @route /api/v1/circles/:circleId/users/:userId/photos
     * @method GET
     * @access public
     */
    static getPhotosByUserId = asyncHandler(async (req, res) => {
        const feedDto =  new FeedsDto({
            circleId: req.params.circleId,
            userId: req.params.userId
        });

        const photoDao = new GalleryDao();
        try {
            const photos = await photoDao.getPhotosByUserId(feedDto);
            res.status(201).json(photos);
        } catch (err) {
            const prefixes = ['Circle', 'User'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
        }
    });

    /**
     * @desc get photos by Id
     * @route /api/v1/circles/:circleIdd/users/:userId/feeds/feedId/photos/photoId
     * @method GET
     * @access public
     */
    static getPhotoById = asyncHandler(async (req, res) => {
        const feedDto =  new FeedsDto({
            id: req.params.feedId,
            circleId: req.params.circleId,
            userId: req.params.userId
        });

        const photoDto = new GalleryDto({
            id: req.params.photoId,
            feedId: req.params.feedId,
        });

        const photoDao = new GalleryDao();
        try {
            const photo = await photoDao.getPhotoById(photoDto, feedDto);
            res.status(201).json(photo);
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'Photo'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
        }
    });

    /**
     * @desc update photos by Id
     * @route /api/v1/circles/:circleId/users/:userId/feeds/feedId/photos/photoId
     * @method PUT
     * @access public
    */
    static updatePhotoById = asyncHandler(async (req, res) => {
        const feedDto =  new FeedsDto({
            id: req.params.feedId,
            circleId: req.params.circleId,
            userId: req.params.userId
        });

        const photoDto = new GalleryDto(req.body);
        photoDto.id = req.params.photoId;
        photoDto.feedId = req.params.feedId;

        const error = GalleryValidator.updateGallery(photoDto);
        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }

        const photoDao = new GalleryDao();
        try {
                await photoDao.updatePhotoById(photoDto, feedDto);
            res.status(201).json({ message: 'Photo is updated.'});
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'Photo'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
        }
    });

}

module.exports = { GalleryController };