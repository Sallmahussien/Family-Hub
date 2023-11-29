const { prisma } = require('../client.db');
const { validateCircleId } = require('./common/validateCircleId');
const { validateUserId } = require('./common/validateUserId');
const { validateFeedIdWithCircleId } = require('./common/validateFeedIdWithCircleId')


class LikesDao {
    async createLike (likeDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, likeDto.userId);
        await validateFeedIdWithCircleId(feedDto);

        let deleted = await prisma.likes.findFirst({
            select: {
                deleted: true
            },
            where: {
                feedId: likeDto.feedId,
                userId: likeDto.userId
            }
        });

        let like;

        if (deleted) {
            await prisma.likes.update({
                where: {
                    feedId_userId: {
                        feedId: likeDto.feedId,
                        userId: likeDto.userId,
                    },
                },
                data: {
                    deleted: false
                }
            });

            like = await prisma.likes.findFirst({
                where: {
                    feedId: likeDto.feedId,
                    userId: likeDto.userId
                }
            });

        } else {
            like = await prisma.likes.create({
                data: likeDto
            });
        }

        return like;
    }

    async getLikesByFeedId (feedDto, likeDto) {
        await validateCircleId(feedDto.circleId);
        await validateFeedIdWithCircleId(feedDto);

        const likes = await prisma.likes.findMany({
            where: {
                feedId: feedDto.id,
                deleted: false
            }
        });

        return likes;
    }

    async deleteLikeById (feedDto, likeDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, likeDto.userId);
        await validateFeedIdWithCircleId(feedDto);

        await this.validateLikeId(feedDto);

        await prisma.likes.update({
           where: {
            feedId_userId: {
                feedId: likeDto.feedId,
                userId: likeDto.userId,
            },
            deleted: false
           },
           data: {
            deleted: true
           }
        });
    }

    async validateLikeId(feedDto) {
        const like = await prisma.likes.findFirst({
            where: {
                feedId: feedDto.id,
                userId: feedDto.userId,
                deleted: false
            },
        });
    
        if (!like) {
            throw new Error('Like Id is invalid.');
        }
    }
}

module.exports = { LikesDao };