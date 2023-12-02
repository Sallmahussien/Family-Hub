const { prisma } = require('../../client.db');

async function validateFeedId(feedDto) {
    const feed = await prisma.feeds.findUnique({
        where: {
            id: feedDto.id,
            circleId: feedDto.circleId,
            userId: feedDto.userId,
            deleted: false,
        },
    });

    if (!feed) {
        throw new Error('Feed Id is invalid.');
    }
}

module.exports = { validateFeedId }