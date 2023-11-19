const { prisma } = require('../client.db');

class CommentsDao {

    async createComment (commentDto) {
        const comment = await prisma.comments.create({
            data: commentDto
        });

        return comment;
    }

    async getCommentsByFeedId (feedId) {
        const comments = await prisma.comments.findMany({
            where: {
                feedId: feedId,
                deleted: false
            }
        });

        return comments;
    }

    async updateCommentById (updateCommentDto) {
        await prisma.comments.update({
            where: {
                id: updateCommentDto.id,
                deleted: false
            },
            data: updateCommentDto
        });
    }

    async deleteCommentById (commentId) {
        await prisma.comments.update({
            where: {
                id: commentId,
                deleted: false
            },

            data: {
                deleted: true
            }
        });
    }

    async deleteCommentsByFeedId (feedId) {
        const commentsIds = await prisma.comments.findMany({
            select: {
                id: true
            },
            where: {
                feedId: feedId,
                deleted: false
            }
        });

        const commentsIdsList = commentsIds.map((comment) => comment.id);

        await prisma.comments.updateMany({
            where: {
                id: {
                    in: commentsIdsList
                }
            },
            data: {
                deleted: true
            }
        });
    }
}

module.exports = { CommentsDao };