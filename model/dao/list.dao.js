const { prisma } = require('../client.db');
const { FeedsDao } = require('./feed.dao');
const Feed = new FeedsDao();


class ListsDao {

    async createList (listDto, feedDto) {
        const feed = await Feed.createFeed(feedDto)
        listDto.feedId = feed.id
        const list = await prisma.lists.create({
            data: listDto
        });
        return list;
    }


    async getListsByCircleId (circleId) {
        const feeds = await Feed.getFeedsBytype({circleId: circleId, type: 'LIST'});

        return feeds;
    }


    async getistById (listId) {
        const list = await prisma.lists.findUnique({
            where: {
                id: listId
            }
        })
        return list;
    }

    async updateListById (listDto) {
        await prisma.lists.update({
            where: {
                id: listDto.id
            },
            data: listDto
        });
    }

}

module.exports = { ListsDao }