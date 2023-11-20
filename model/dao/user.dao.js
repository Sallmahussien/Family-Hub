const { prisma } = require('../client.db');
const { FeedsDao } = require('./feed.dao')

const Feed = new FeedsDao();

class UsersDao {

    async createUser (userDto) {
        const user = await prisma.users.create({
            data: userDto
        });

        console.log(user);
        return user;
    }

    async getUsersByCircleId (circleId) {
        const users = await prisma.users.findMany({
            where: {
                circleId: circleId,
                deleted: false
            }
        });

        console.log(users);
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
        console.log(user);

        return user;
    }

    async updateUserById (userDto) {
        await prisma.users.update({
            where: {
                id: userDto.id,
                deleted: false
            },
            data: userDto
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

    async deleteUserById (userId) {

        await Feed.deleteFeedsByUserId(userId);

        await prisma.users.update({
            where: {
                id: userId,
            },
            data: {
                deleted: true
            }
        });
    }   
}

module.exports = { UsersDao };