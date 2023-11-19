const { prisma } = require('../client.db');
const { FeedsDao } = require('./feed.dao');
const Feed = new FeedsDao();


class ListsDao {

    async createList (createListDTO, createFeedDTO) {
        const feed = await Feed.createFeed(createFeedDTO)
        createListDTO.feedId = feed.id
        const list = await prisma.lists.create({
            data: createListDTO
        });
        return list;
    }


    async getListsByCircleId (circleId) {
        const feeds = await Feed.getFeedsBytype(circleId, 'LIST');

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

    async updateListById (listId, updateListDTO) {
        await prisma.lists.update({
            where: {
                id: listId
            },
            data: updateListDTO
        });
    }

}

module.exports = { ListsDao }