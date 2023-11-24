const { prisma } = require('../client.db');
const { validateFeedId } = require('./common/validateFeedId');

class CommentsDao {

    async createComment (commentDto) {
        const comment = await prisma.comments.create({
            data: commentDto
        });

        return comment;
    }

    async getCommentsByFeedId (feedDto) {
        await validateFeedId(feedDto);

        const comments = await prisma.comments.findMany({
            where: {
                feedId: feedDto.feedId,
                deleted: false
            }
        });

        return comments;
    }

    async updateCommentById (commentDto) {
        await this.validateCommentId(commentDto);

        await prisma.comments.update({
            where: {
                id: commentDto.id,
                deleted: false
            },
            data: commentDto
        });
    }

    async deleteCommentById (commentDto) {
        await this.validateCommentId(commentDto);

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
    
    async validateCommentId(commentDto) {
        const comment = await prisma.comments.findUnique({
            where: {
                id: commentDto.id,
            },
        });
    
        if (!comment) {
            throw new Error('Comment Id is invalid.');
        }
    }
}

module.exports = { CommentsDao };