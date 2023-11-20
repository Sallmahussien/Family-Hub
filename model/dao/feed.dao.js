const { prisma } = require('../client.db');
const { LikesDao } = require('./like.dao');
const { CommentsDao } = require('./comment.dao');

const Likes = new LikesDao();
const Comments = new CommentsDao();


class FeedsDao {

    async createFeed(createFeedDto) {
        const feed = await prisma.feeds.create({
            data: createFeedDto
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
                post: true,
                event: true,
                list: true,
                photo: true,
                comments: true,
                likes: true
            }
        });

        console.log(feeds)

        return feeds;
    }

    async getFeedById(feedId) {
        const feed = await prisma.feeds.findUnique({
            where: {
                id: feedId,
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

        console.log(feed)

        return feed
    }

    async getFeedsBytype(circleId, type) {
        const feeds = await prisma.feeds.findMany({
            where: {
                circleId: circleId,
                deleted: false,
                type: type
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

        console.log(feeds);
        return feeds;
    }

    async deleteFeedById(feedId) {
        
        await Likes.deleteLikesByFeedId(feedId);
        await Comments.deleteCommentsByFeedId(feedId);

        await prisma.feeds.update({
            where: {
                id: feedId
            },
            data: true
        });
    }

    async deleteFeedsByCircleId(circleId) {
        const feedsIds = await prisma.feeds.findMany({
            select: {
                id: true
            },
            where: {
                circleId: circleId,
                deleted: false
            }
        });

        const feedsIdsList = feedsIds.map((feed) => feed.id);

        feedsIdsList.forEach(async feedId => {
            await this.deleteFeedById(feedId);
        });
    }

    async deleteFeedsByUserId(userId) {
        const feedsIds = await prisma.feeds.findMany({
            select: {
                id: true
            },
            where: {
                userId: userId,
                deleted: false
            }
        });

        const feedsIdsList = feedsIds.map((feed) => feed.id);

        feedsIdsList.forEach(async feedId => {
            await this.deleteFeedById(feedId);
        });
    }

}

module.exports = { FeedsDao };