const { prisma } = require('../client.db');
const { createFeed } = require('./common/createFeed');
const { getFeedsBytype } = require('./common/getFeedsByType');

class GalleryDao {

    async createPhoto(galleryDto, feedDto) {
        feedDto.type = 'PHOTO';
        const feed = await createFeed(feedDto)
        galleryDto.feedId = feed.id
        const photo = await prisma.gallery.create({
            data: galleryDto
        });

        return photo;
    }

    async getPhotoByCircleId(feedDto) {
        const feeds = await getFeedsBytype({ circleId: feedDto.circleId, type: 'PHOTO' });

        return feeds;
    }


    async getPhotosByUserId(feedDto) {
        const feeds = await getFeedsBytype({ circleId: feedDto.circleId, type: 'PHOTO' });
        const photosForUser = []

        feeds.forEach(feed => {
            if (feed.userId === feedDto.userId) photosForUser.push(feed);
        });

        return photosForUser;
    }

    async getPhotoById(galleryDto) {
        const photo = await prisma.gallery.findUnique({
            where: {
                id: galleryDto.id
            }
        });

        return photo;
    }

    async updatePhotoById(galleryDto) {
        await prisma.gallery.update({
            where: {
                id: galleryDto.id
            },
            data: galleryDto
        });
    }

}

module.exports = { GalleryDao }