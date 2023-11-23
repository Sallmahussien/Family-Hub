const { prisma } = require('../client.db');
const { createFeed } = require('./common/createFeed');
const { getFeedsBytype } = require('./common/getFeedsByType');

class EventsDao {

    async createEvent(eventDto, feedDto) {
        feedDto.type = 'EVENT';

        const feed = await createFeed(feedDto);
        eventDto.feedId = feed.id;
        const event = await prisma.events.create({
            data: eventDto
        });

        return event;
    }

    async getEventsByCircleId(feedDto) {
        const feeds = await getFeedsBytype({ circleId: feedDto.circleId, type: 'EVENT' });

        return feeds;
    }

    async getEventById(eventDto) {
        const event = await prisma.events.findUnique({
            where: {
                id: eventDto.id,
                feedId: eventDto.feedId,
            }
        });

        return event;
    }

    async updateEventById(eventDto) {
        await prisma.events.update({
            where: {
                id: eventDto.id,
            },
            data: eventDto
        });
    }

}

module.exports = { EventsDao };