const { prisma } = require('../client.db');
const { LikesDao } = require('./like.dao');
const { CommentsDao } = require('./comment.dao');

const Likes = new LikesDao();
const Comments = new CommentsDao();


class FeedsDao {

    async createFeed(feedDto) {
        const feed = await prisma.feeds.create({
            data: feedDto
        });

        console.log(feed)

        return feed;
    }

    async getFeedsByCircleId(feedDto) {
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

        console.log(feeds)

        return feeds;
    }

    async getFeedById(feedDto) {
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

        console.log(feed)

        return feed
    }

    async getFeedsBytype(feedDto) {
        const feeds = await prisma.feeds.findMany({
            where: {
                circleId: feedDto.circleId,
                deleted: false,
                type: feedDto.type
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
                id: feedId,
                deleted: false
            },
            data: {
                deleted: true
            }
        });
    }

    // helper function
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

    // helper function
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