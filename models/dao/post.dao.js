const { prisma } = require('../client.db');
const { createFeed } = require('./common/createFeed');
const { getFeedsBytype } = require('./common/getFeedsByType');
const { validateCircleId } = require('./common/validateCircleId');
const { validateUserId } = require('./common/validateUserId');
const { validateFeedId } = require('./common/validateFeedId');

class PostsDao {

    async createPost(postDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);

        const feed = await createFeed(feedDto);
        postDto.feedId = feed.id;
        const post = await prisma.posts.create({
            data: postDto
        });

        return post;
    }

    async getPostsByCircleId(feedDto) {
        await validateCircleId(feedDto.circleId);

        const feeds = await getFeedsBytype({ circleId: feedDto.circleId, type: 'POST' });

        return feeds;
    }

    async updatePostById(postDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);
        await validateFeedId(feedDto);

        const post = await prisma.posts.findUnique({
            where: {
                id: postDto.id,
            }
        });

        if (!post) throw new Error('Post Id is invalide.');

        await prisma.posts.update({
            where: {
                id: postDto.id,
            },
            data: postDto
        })
    }

}


module.exports = { PostsDao }