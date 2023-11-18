const { prisma } = require('../client.db');

class UsersDao {

    async createUser (createUserDto) {
        const user = await prisma.users.create({
            data: createUserDto
        });

        return user;
    }

    async getUsersByCircleId (circleId) {
        const users = await prisma.users.findMany({
            where: {
                circleId: circleId,
                deleted: false
            }
        });
        return users;
    }

    async getUserById (userId) {
        const user = await prisma.users.findUnique({
            where: {
                id: userId,
                deleted: false
            },
            include: {
                feeds: true,
                comments: true,
                likes: true
            }
        });

        return user;
    }

    async updateUserById (userId, updateUserDto) {
        await prisma.users.update({
            where: {
                id: userId,
                deleted: false
            },
            data: updateUserDto
        });
    }


    async deleteUserById (userId) {

        const user = await this.getUserById(userId);

        await prisma.users.update({
            where: {
                id: userId,
            },
            data: {
                deleted: true
            }
        });


        const likesIds = [];
        const commentsIds = [];
        const feedsIds = [];

        user.likes.forEach(like => {
            likesIds.push(like.id);
        });

        user.comments.forEach(comment => {
            commentsIds.push(comment.id);
        });

        user.feeds.forEach(feed => {
            feedsIds.push(feed.id);
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

        await prisma.feeds.updateMany({
            where: {
                id: {
                    in: feedsIds
                }
            },
            data: {
                deleted: true
            }
        });
    }
}

module.exports = { UsersDao };