const { prisma } = require('../client.db');
const { createFeed } = require('./common/createFeed');
const { getFeedsBytype } = require('./common/getFeedsByType');
const { validateCircleId } = require('./common/validateCircleId');
const { validateUserId } = require('./common/validateUserId');
const { validateFeedId } = require('./common/validateFeedId');
const { validateListId } = require('./common/validateListId');

class ListsDao {

    async createList(listDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);

        feedDto.type = 'LIST';
        const feed = await createFeed(feedDto);
        listDto.feedId = feed.id;
        const list = await prisma.lists.create({
            data: listDto
        });

        return list;
    }


    async getListsByCircleId(feedDto) {
        await validateCircleId(feedDto.circleId);

        const feeds = await getFeedsBytype({ circleId: feedDto.circleId, type: 'LIST' });

        return feeds;
    }


    async getListById(listDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);
        await validateFeedId(feedDto);
        await validateListId(listDto);

        const list = await prisma.lists.findUnique({
            where: {
                id: listDto.id
            }
        });

        return list;
    }

    async updateListById(listDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);
        await validateFeedId(feedDto);
        await validateListId(listDto);

        await prisma.lists.update({
            where: {
                id: listDto.id
            },
            data: listDto
        });
    }
}

module.exports = { ListsDao }