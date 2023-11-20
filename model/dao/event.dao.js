const { prisma } = require('../client.db');
const { FeedsDao } = require('./feed.dao');
const Feed = new FeedsDao();

class EventsDao {

    async createEvent (eventDto, feedDto) {
        feedDto.type = 'EVENT';

        const feed = await Feed.createFeed(feedDto);
        eventDto.feedId = feed.id;
        const event = await prisma.events.create({
            data: eventDto
        });

        return event;
    }

    async getEventsByCircleId (circleId) {
        const feeds = await Feed.getFeedsBytype({circleId: circleId, type:'EVENT'});

        return feeds;
    }

    async getEventById (eventId, feedId) {
        const event = await prisma.events.findUnique({
            where: {
                id: eventId,
                feedId: feedId,
            }
        });

        return event;
    }

    async updateEventById (eventDto) {
        await prisma.events.update({
            where: {
                id: eventDto.id,
            },
            data: eventDto
        });
    }

}

module.exports = { EventsDao };