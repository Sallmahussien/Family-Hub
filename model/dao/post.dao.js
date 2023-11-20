const { prisma } = require('../client.db');
const { FeedsDao } = require('./feed.dao');
const Feed = new FeedsDao();

class PostsDao {

    async createPost(postDto, feedDto) {
        const feed = await Feed.createFeed(feedDto)
        postDto.feedId = feed.id
        const post = await prisma.posts.create({
            data: postDto
        });
        return post;
    }


    async getPostByCircleId(feedDto) {
        const feeds = await Feed.getFeedsBytype(feedDto.circleId, 'POST');
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