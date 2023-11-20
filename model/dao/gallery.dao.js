const { prisma } = require('../client.db');
const { FeedsDao } = require('./feed.dao');
const Feed = new FeedsDao();

class GalleriesDao {

    async createPhoto (photoDto, feedDto) {
        feedDto.type = 'PHOTO';
        const feed = await Feed.createFeed(feedDto)
        photoDto.feedId = feed.id
        const photo = await prisma.gallery.create({
            data: photoDto
        });
        return photo;
    }


    async getPhotoByCircleId (circleId) {
        const feeds = await Feed.getFeedsBytype({circleId: circleId, type:'PHOTO'});
  
        return feeds;
    }


    async getPhotosByUserId (feedDto) {
        const feeds = await Feed.getFeedsBytype({circleId: feedDto.circleId, type:'PHOTO'});
        const photosForUser = []

        feeds.forEach(feed =>{
            if (feed.userId === feedDto.userId) photosForUser.push(feed);
        });
        return photosForUser;
    }

    async getPhotoById (photoId) {
        const photo = await prisma.gallery.findUnique({
            where: {
                id: photoId
            }
        });

        return photo;
    }

    async updatePhotoById (photoDto) {
        await prisma.gallery.update({
            where: {
                id: photoDto.id
            },
            data: photoDto
        });
    }

}

module.exports = { GalleriesDao }