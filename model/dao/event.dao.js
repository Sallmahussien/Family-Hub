const { prisma } = require('../client.db');
const { FeedsDao } = require('./feed.dao');
const Feed = new FeedsDao();

class EventsDao {

    async createEvent (eventDto, feedDto) {
        feedDto.type = 'EVENT';

        const feed = await Feed.createFeed(createFeedDTO);
        createEventDto.feedId = feed.id;
        const event = await prisma.events.create({
            data: createEventDto
        });

        return event;
    }

    async getEventsByCircleId (circleId) {
        const feeds = await Feed.getFeedsBytype(circleId, 'EVENT');

        return feeds;
    }

    async getEventById (eventId) {
        const event = await prisma.feeds.findUnique({
            where: {
                id: eventId,
                deleted: false
            },
            include: {
                event: true,
                comments: true,
                likes: true
            }
        });

        return event;
    }

    async updateEventById (eventId, updateEventDTO) {
        await prisma.events.update({
            where: {
                id: eventId,
            },
            data: updateEventDTO
        });
    }

}

module.exports = { EventsDao };