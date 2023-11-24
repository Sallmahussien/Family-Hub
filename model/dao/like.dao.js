const { prisma } = require('../client.db');
const { validateFeedId } = require('./common/validateFeedId');

class LikesDao {
    async createLike (likeDto) {
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
                    // feedId_userId: {
                    //     feedId: likeDto.feedId,
                    //     userId: likeDto.userId,
                    // },
                    id: id,
                    feedId: likeDto.feedId,
                    userId: likeDto.userId,
                },
                data: {
                    deleted: false
                }
            });
        if (!deleted) return null
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

    async getLikesByFeedId (feedDto) {
        await validateFeedId(feedDto);

        const likes = await prisma.likes.findMany({
            where: {
                feedId: feedDto.feedId,
                deleted: false
            }
        });

        return likes;
    }

    async deleteLikeById (likeDto) {
        await this.validateLikeId(likeDto);

        await prisma.likes.update({
           where: {
            id: likeDto.id,
            deleted: false
           },
           data: {
            deleted: true
           }
        });
    }
    async validateLikeId(likeDto) {
        const like = await prisma.likes.findUnique({
            where: {
                id: likeDto.id,
            },
        });
    
        if (!like) {
            throw new Error('Like Id is invalid.');
        }
    }
}

module.exports = { LikesDao };