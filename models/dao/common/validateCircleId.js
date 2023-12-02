const { prisma } = require('../../client.db');

async function validateCircleId(circleId) {
    const circle = await prisma.circles.findUnique({
        where: {
            id: circleId,
            deleted: false
        },
    });

    if (!circle) {
        throw new Error('Circle Id is invalid.');
    }
}

module.exports = { validateCircleId }