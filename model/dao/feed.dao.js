const { prisma } = require('../client.db');


class FeedsDao {

    async createFeed(createFeadDto) {
        const feed = await prisma.feeds.create({
            data: createFeadDto
        });

        return feed;
    }

    async getFeedsByCircleId(circleId) {
        const feeds = await prisma.feeds.findMany({
            where: {
                circleId: circleId,
                deleted: false
            },
            include: {
                comments: true,
                likes: true
            }
        });

        return feeds;
    }

    async getFeedsByUserId(userId) {
        const feeds = await prisma.feeds.findMany({
            where: {
                userId: userId,
                deleted: false
            },
            include: {
                comments: true,
                likes: true
            }
        });

        return feeds;
    }

    async getFeedById(feedId) {
        const feed = await prisma.feeds.findUnique({
            where: {
                id: feedId,
                deleted: false
            },
            include: {
                likes: true,
                comments: true
            }
        });

        return feed
    }

    async deleteFeedById(feedId) {
        const feed = await this.getFeedById(feedId);
        const likesIds = [];
        const commentsIds = [];

        feed.likes.forEach(like => {
            likesIds.push(like.id);
        });

        feed.comments.forEach(comment => {
            commentsIds.push(comment.id);
        });

        await prisma.feeds.update({
            where: {
                id: feedId
            },
            data: {
                deleted: true
            }
        });

        await prisma.likes.updateMany({
            where: {
                id: {
                    in: likesIds
                },
                deleted: false
            },
            data: {
                deleted: true
            }
        });

        await prisma.comments.updateMany({
            where: {
                id: {
                    in: commentsIds
                },
                deleted: false
            },
            data: {
                deleted: true
            }
        });
    }

}

module.exports = { FeedsDao };