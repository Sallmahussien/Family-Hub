const { prisma } = require('../client.db');
const { UsersDao } = require('./user.dao');
const { FeedsDao } = require('./feed.dao');
const { ContactBooksDao } = require('./contactbook.dao');

const User = new UsersDao();
const Feed = new FeedsDao();
const ContactBooks = new ContactBooksDao();


class CirclesDao {
    async createCircle (circleDto) {
        const circle = await prisma.circles.create({
            data: createCircleDto
        });

        return circle;
    }

    async getCirleByUserId (circleDto) {
        const user = await prisma.users.findUnique({
            where: {
                id: circleDto.id,
                deleted: false
            },
            include: {
                circle: true
            }
        });

        return user.circle;
    }

    async updateCircle (circleDto) {

        await prisma.circles.update({
            where: {
                id: circleDto.id,
                deleted: false
            },
            data: updateCircleDto
        });
    }

    async deleteCircle (circleDto) {
        await prisma.circles.update({
            where: {
                id: circleDto.id,
                deleted: false
            },
            data: {
                deleted: true
            }
        });

        await User.deleteUsersByCircleId(circleDto.id);
        await ContactBooks.deleteContactsByCircleId(circleDto.id);
        await Feed.deleteFeedsByCircleId(circleDto.id);   
    }
}

module.exports = { CirclesDao };