const { prisma } = require('../client.db');

class LikesDao {
    async creatLike (likeDto) {
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

    async getLikesByFeedId (feedId) {
        const likes = await prisma.likes.findMany({
            where: {
                feedId: feedId,
                deleted: false
            }
        });

        return likes;
    }

    async deleteLikeById (likeId) {
        await prisma.likes.update({
           where: {
            id: likeId,
            deleted: false
           },
           data: {
            deleted: true
           }
        });
    }

    async deleteLikesByFeedId (feedId) {
        const likesIds = await prisma.likes.findMany({
            select: {
                id: true
            },
            where: {
                feedId: feedId,
                deleted: false
            }
        });

        const likesIdsList = likesIds.map((like) => like.id);

        await prisma.likes.updateMany({
            where: {
                id: {
                    in: likesIdsList
                }
            },
            data: {
                deleted: true
            }
        });
    }

}

module.exports = { LikesDao };