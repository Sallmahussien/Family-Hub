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
            data: circleDto
        });
        console.log(circle)
        return circle;
    }

    async getCirleById (circleId){
        const circle = await prisma.circles.findFirst({
            where: {
                id: circleId,
                deleted: false
            },
            include:{
                contacts: true,
                feeds: true,
                users: true,
            }
        });
        console.log(circle)
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
        console.log(user.circle)
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

    async deleteCircle (circleId) {
        await prisma.circles.update({
            where: {
                id: circleId,
                deleted: false
            },
            data: {
                deleted: true
            }
        });

        await User.deleteUsersByCircleId(circleId);
        await ContactBooks.deleteContactsByCircleId(circleId);
        await Feed.deleteFeedsByCircleId(circleId);   
    }
}

module.exports = { CirclesDao };