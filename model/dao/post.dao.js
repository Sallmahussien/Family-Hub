const { prisma } = require('../client.db');
const { createFeed } = require('./common/createFeed');
const { getFeedsBytype } = require('./common/getFeedsByType');

class PostsDao {

    async createPost(postDto, feedDto) {
        const feed = await createFeed(feedDto)
        postDto.feedId = feed.id
        const post = await prisma.posts.create({
            data: postDto
        });

        return post;
    }

    async getPostsByCircleId(feedDto) {
        const feeds = await getFeedsBytype({ circleId: feedDto.circleId, type: 'POST' });

        return feeds;
    }

    async updatePostById(postDto) {
        await prisma.posts.update({
            where: {
                id: postDto.id,
            },
            data: postDto
        })
    }

}


module.exports = { PostsDao }