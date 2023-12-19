const { prisma } = require('../client.db');
const { createFeed } = require('./common/createFeed');
const { getFeedsBytype } = require('./common/getFeedsByType');
const { validateCircleId } = require('./common/validateCircleId');
const { validateUserId } = require('./common/validateUserId');
const { validateFeedId } = require('./common/validateFeedId');

class EventsDao {

    async createEvent(eventDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);

        feedDto.type = 'EVENT';
        const feed = await createFeed(feedDto);

        eventDto.feedId = feed.id;
        const formattedDto = this.formatEventDtoDates(eventDto);

        const event = await prisma.events.create({
            data: formattedDto
        });

        return event;
    }

    async getEventsByCircleId(feedDto) {
        await validateCircleId(feedDto.circleId);

        const feeds = await getFeedsBytype({ circleId: feedDto.circleId, type: 'EVENT' });

        return feeds;
    }

    async getEventById(eventDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);
        await validateFeedId(feedDto);
        await this.validateEventById(eventDto);

        const event = await prisma.events.findUnique({
            where: {
                id: eventDto.id,
                feedId: eventDto.feedId
            }
        });

        return event;
    }

    async updateEventById(eventDto, feedDto) {
        await validateCircleId(feedDto.circleId);
        await validateUserId(feedDto.circleId, feedDto.userId);
        await validateFeedId(feedDto);
        await this.validateEventById(eventDto);

        await prisma.events.update({
            where: {
                id: eventDto.id,
            },
            data: eventDto
        });
    }

    async validateEventById(eventDto) {
        const event = await prisma.events.findUnique({
            where: {
                id: eventDto.id
            }
        });

        if (!event) throw Error('Event Id is invalide.');
    }

    formatEventDtoDates = (eventDto) => {
        const formattedDto = {
            ...eventDto,
        };

        if (eventDto.startDate) {
            formattedDto.startDate = new Date(eventDto.startDate).toISOString();
        }

        if (eventDto.endDate) {
            formattedDto.endDate = new Date(eventDto.endDate).toISOString();
        }

        if (eventDto.reminder) {
            formattedDto.reminder = new Date(eventDto.reminder).toISOString();
        }

        return formattedDto;
    };

}

module.exports = { EventsDao };