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

    async getLikesByFeedId (likeDto) {
        const likes = await prisma.likes.findMany({
            where: {
                feedId: likeDto.feedId,
                deleted: false
            }
        });

        return likes;
    }

    async deleteLikeById (likeDto) {
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
}

module.exports = { LikesDao };