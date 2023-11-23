const { prisma } = require('../client.db');

class CommentsDao {

    async createComment (commentDto) {
        const comment = await prisma.comments.create({
            data: commentDto
        });

        return comment;
    }

    async getCommentsByFeedId (feedDto) {
        const comments = await prisma.comments.findMany({
            where: {
                feedId: feedDto.feedId,
                deleted: false
            }
        });

        return comments;
    }

    async updateCommentById (commentDto) {
        await prisma.comments.update({
            where: {
                id: commentDto.id,
                deleted: false
            },
            data: commentDto
        });
    }

    async deleteCommentById (commentDto) {
        await prisma.comments.update({
            where: {
                id: commentDto.id,
                deleted: false
            },

            data: {
                deleted: true
            }
        });
    }
}

module.exports = { CommentsDao };