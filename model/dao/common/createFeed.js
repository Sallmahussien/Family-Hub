const { prisma } = require('../../client.db');

async function createFeed(feedDto) {
    const feed = await prisma.feeds.create({
        data: feedDto
    });


    return feed;
}

module.exports = { createFeed };