const { prisma } = require('../client.db');
const { deleteFeedByFeedId } = require('./common/deleteFeedById');
const { validateCircleId } = require('./common/validateCircleId')

class FeedsDao {

    async getFeedsByCircleId(feedDto) {

        await validateCircleId(feedDto.circleId);

        const feeds = await prisma.feeds.findMany({
            where: {
                circleId: feedDto.circleId,
                deleted: false
            },
            include: {
                post: true,
                event: true,
                list: true,
                photo: true,
                comments: true,
                likes: true
            }
        });

        return feeds;
    }

    async getFeedById(feedDto) {

        await validateCircleId(feedDto.circleId);

        const feed = await prisma.feeds.findUnique({
            where: {
                id: feedDto.id,
                deleted: false
            },
            include: {
                post: true,
                event: true,
                list: true,
                photo: true,
                comments: true,
                likes: true
            }
        });

        return feed
    }

    async deleteFeedById(feedDto) {
        await validateCircleId(feedDto.circleId);

        await deleteFeedByFeedId(feedDto.id);
    }

}

module.exports = { FeedsDao };