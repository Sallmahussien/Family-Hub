const { prisma } = require('../../client.db');

async function validateFeedIdWithCircleId(feedDto) {
  const feed = await prisma.feeds.findUnique({
    where: {
      id: feedDto.id,
      circleId: feedDto.circleId,
      deleted: false,
    },
  });

  if (!feed) {
    throw new Error('Feed Id is invalid.');
  }
}

module.exports = { validateFeedIdWithCircleId }
