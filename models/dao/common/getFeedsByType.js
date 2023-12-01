const { prisma } = require('../../client.db');

async function getFeedsBytype(feedDto) {
    const feeds = await prisma.feeds.findMany({
        where: {
            circleId: feedDto.circleId,
            deleted: false,
            type: feedDto.type
        },
        include: {
            post: true,
            event: true,
            list: true,
            photo: true,
            comments: true,
            likes: true
        }
    });

    return feeds;
}

module.exports = { getFeedsBytype };