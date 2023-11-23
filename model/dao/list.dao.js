const { prisma } = require('../client.db');
const { createFeed } = require('./common/createFeed');
const { getFeedsBytype } = require('./common/getFeedsByType');

class ListsDao {

    async createList(listDto, feedDto) {
        feedDto.type = 'LIST';
        const feed = await createFeed(feedDto);
        listDto.feedId = feed.id;
        const list = await prisma.lists.create({
            data: listDto
        });

        return list;
    }


    async getListsByCircleId(feedDto) {
        const feeds = await getFeedsBytype({ circleId: feedDto.circleId, type: 'LIST' });

        return feeds;
    }


    async getListById(listDto) {
        const list = await prisma.lists.findUnique({
            where: {
                id: listDto.id
            }
        });

        return list;
    }

    async updateListById(listDto) {
        await prisma.lists.update({
            where: {
                id: listDto.id
            },
            data: listDto
        });
    }
}

module.exports = { ListsDao }