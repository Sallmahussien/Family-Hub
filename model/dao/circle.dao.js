const { prisma } = require('../client.db');
const { deleteFeedByFeedId } = require('./common/deleteFeedById');
const { validateCircleId } = require('./common/validateCircleId');

class CirclesDao {
    async createCircle (circleDto) {
        const circle = await prisma.circles.create({
            data: circleDto
        });

        return circle;
    }

    async getCirleById (circleDto){
        await validateCircleId(circleDto.id);

        const circle = await prisma.circles.findFirst({
            where: {
                id: circleDto.id,
                deleted: false
            },
            include:{
                contacts: true,
                feeds: true,
                users: true,
            }
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

    async updateCircle (circleDto) {
        await validateCircleId(circleDto.id);

        await prisma.circles.update({
            where: {
                id: circleDto.id,
                deleted: false
            },
            data: circleDto
        });
    }

    async deleteCircleById (circleDto) {
        await validateCircleId(circleDto.id);

        await prisma.circles.update({
            where: {
                id: circleDto.id,
                deleted: false
            },
            data: {
                deleted: true
            }
        });

        await this.deleteUsersByCircleId(circleDto.id);
        await this.deleteContactsByCircleId(circleDto.id);
        await this.deleteFeedsByCircleId(circleDto.id);  
    }

    async deleteFeedsByCircleId(circleId) {
        const feedsIds = await prisma.feeds.findMany({
            select: {
                id: true
            },
            where: {
                circleId: circleId,
                deleted: false
            }
        });

        const feedsIdsList = feedsIds.map((feed) => feed.id);

        feedsIdsList.forEach(async feedId => {
            await deleteFeedByFeedId (feedId);
        });
    }

    async deleteUsersByCircleId(circleId) {
        const usersIds = await prisma.users.findMany({
            select: {
                id: true
            },
            where: {
                circleId: circleId,
                deleted: false
            }
        });

        const usersIdsList = usersIds.map((user) => user.id);

        await prisma.users.updateMany({
            where: {
                id: {
                    in: usersIdsList
                }
            },
            data: {
                deleted: true
            }
        });
    }

    async deleteContactsByCircleId (circleId) {
        await prisma.contactBooks.updateMany({
            where: {
                circleId: circleId,
                deleted: false
            },
            data: {
                deleted: true
            }
        });
    };
}

module.exports = { CirclesDao };