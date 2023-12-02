const { prisma } = require('../client.db');
const { createFeed } = require('./common/createFeed');
const { getFeedsBytype } = require('./common/getFeedsByType');
const { validateCircleId } = require('./common/validateCircleId');
const { validateUserId } = require('./common/validateUserId');
const { validateFeedId } = require('./common/validateFeedId');

class GalleryDao {

    async createPhoto(galleryDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);

        feedDto.type = 'PHOTO';

        const feed = await createFeed(feedDto);
        galleryDto.feedId = feed.id;

        const photo = await prisma.gallery.create({
            data: galleryDto
        });

        return photo;
    }

    async getPhotoByCircleId(feedDto) {
        await validateCircleId(feedDto.circleId);

        const feeds = await getFeedsBytype({ circleId: feedDto.circleId, type: 'PHOTO' });

        return feeds;
    }


    async getPhotosByUserId(feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);

        const feeds = await getFeedsBytype({ circleId: feedDto.circleId, type: 'PHOTO' });
        const photosForUser = []

        feeds.forEach(feed => {
            if (feed.userId === feedDto.userId) photosForUser.push(feed);
        });

        return photosForUser;
    }

    async getPhotoById(galleryDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);
        await validateFeedId(feedDto);
        await this.validatePhoto(galleryDto);

        const photo = await prisma.gallery.findUnique({
            where: {
                id: galleryDto.id
            }
        });

        return photo;
    }

    async updatePhotoById(galleryDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);
        await validateFeedId(feedDto);
        await this.validatePhoto(galleryDto);

        await prisma.gallery.update({
            where: {
                id: galleryDto.id
            },
            data: galleryDto
        });
    }

    async validatePhoto (galleryDto) {
        const photo = await prisma.gallery.findUnique({
            where: {
                id: galleryDto.id
            }
        });

        if (!photo) throw Error('Photo Id is invalide.');
    }

}

module.exports = { GalleryDao }