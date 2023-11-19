const { prisma } = require('../client.db');
const { FeedsDao } = require('./feed.dao');
const Feed = new FeedsDao();

class GalleriesDao {

    async createOrAddPhoto (createPhotoDTO, createFeedDTO) {
        createFeedDTO.type = 'PHOTO';
        const feed = await Feed.createFeed(createFeedDTO)
        createPhotoDTO.feedId = feed.id
        const photo = await prisma.gallery.create({
            data: createPhotoDTO
        });

        return photo;
    }


    async getPhotoByCircleId (circleId) {
        const feeds = await Feed.getFeedsBytype(circleId, 'PHOTO');

        return feeds;
    }


    async getPhotosByUserId (userId, circleId) {
        const feeds = await Feed.getFeedsBytype(circleId, 'PHOTO');
        const photosForUser = []

        feeds.forEach(feed =>{
            if (feed.userId === userId) photosForUser.push(feed);
        })

        return photosForUser;
    }



    async updatePhotoById (photoId, updatePhotoDTO) {
        await prisma.gallery.update({
            where: {
                id: photoId
            },
            data: updatePhotoDTO
        });
    }

}

module.exports = { GalleriesDao }