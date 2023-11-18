const { prisma } = require('../client.db');


class CirclesDao {
    async createCircle (createCircleDto) {
        const circle = await prisma.circles.create({
            data: createCircleDto
        });

        return circle;
    }

    async getCirleByUserId (userId) {
        const user = await prisma.users.findUnique({
            where: {
                id: userId,
                deleted: false
            },
            include: {
                circle: true
            }
        });

        return user.circle;
    }

    async updateCircle (circleId, updateCircleDto) {

        await prisma.circles.update({
            where: {
                id: circleId
            },
            data: updateCircleDto
        });
    }

    async deleteCircle (circleId) {
        await prisma.circles.update({
            where: {
                id: circleId
            },
            data: {
                deleted: true
            }
        });

        await prisma.users.updateMany({
            where: {
                circleId: circleId,
            },
            data: {
                deleted: true
            }
        });

        await prisma.feeds.updateMany({
            where: {
                circleId: circleId
            },
            data: {
                deleted: true
            }
        });

        await prisma.contactBooks.updateMany({
            where: {
                circleId: circleId
            },
            data: {
                deleted: true
            }
        });

        const users = await prisma.users.findMany({
            where: {
                circleId: circleId,
            },
            include: {
                likes: true,
                comments: true
            }
        });

        const likesIds = [];
        const commentsIds = [];

        users.forEach(user => {
            user.likes.forEach(like => {
                likesIds.push(like.id);
            });

            user.comments.forEach(comment => {
                commentsIds.push(comment.id);
            });
        });

        await prisma.likes.updateMany({
            where: {
                id: {
                    in: likesIds
                }
            },
            data: {
                deleted: true
            }
        });

        await prisma.comments.updateMany({
            where: {
                id: {
                    in: commentsIds
                }
            },
            data: {
                deleted: true
            }
        });
    }
}

module.exports = { CirclesDao };
