const { prisma } = require('../client.db');
const { FeedsDao } = require('./feed.dao');
const Feed = new FeedsDao();

class PostsDao {

    async createPost (createPostDto, createFeedDTO) {
        const feed = await Feed.createFeed(createFeedDTO)
        createPostDto.feedId = feed.id
        const post = await prisma.posts.create({
            data: createPostDto
        });

        return post;
    }


    async getPostByCircleId (circleId) {
        const feeds = await Feed.getFeedsBytype(circleId, 'POST');

        return feeds;
    }


    async updatePstById (postId, updatePostDTO) {
        await prisma.posts.update({
            where: {
                id: postId,
            },
            data: updatePostDTO
        })
    }

}


module.exports ={ PostsDao }