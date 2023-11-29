const { prisma } = require('../client.db');
const { validateUserId } = require('./common/validateUserId');
const { validateCircleId } = require('./common/validateCircleId');
const { validateFeedIdWithCircleId } = require('./common/validateFeedIdWithCircleId')

class CommentsDao {

    async createComment (commentDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateFeedIdWithCircleId(feedDto);
        await validateUserId(feedDto.circleId, commentDto.userId);

        const comment = await prisma.comments.create({
            data: commentDto
        });

        return comment;
    }

    async getCommentsByFeedId (feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateFeedIdWithCircleId(feedDto);

        const comments = await prisma.comments.findMany({
            where: {
                feedId: feedDto.feedId,
                deleted: false
            }
        });

        return comments;
    }

    async updateCommentById (commentDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateFeedIdWithCircleId(feedDto);
        await validateUserId(feedDto.circleId, commentDto.userId);
        await this.validateCommentId(commentDto);

        await prisma.comments.update({
            where: {
                id: commentDto.id,
                deleted: false
            },
            data: commentDto
        });
    }

    async deleteCommentById (commentDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateFeedIdWithCircleId(feedDto);
        await validateUserId(feedDto.circleId, commentDto.userId);
        await this.validateCommentId(commentDto);

        await prisma.comments.update({
            where: {
                id: commentDto.id,
                userId: commentDto.userId,
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
                userId: commentDto.userId
            },
        });
    
        if (!comment) {
            throw new Error('Comment Id is invalid.');
        }
    }
}

module.exports = { CommentsDao };