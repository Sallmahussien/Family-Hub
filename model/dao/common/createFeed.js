const { prisma } = require('../../client.db');
const { validateUserId } = require('./validateUserId')

async function createFeed(feedDto) {
    await validateUserId(feedDto.circleId, feedDto.userId) 
    const feed = await prisma.feeds.create({
        data: feedDto
    });


    return feed;
}

module.exports = { createFeed };