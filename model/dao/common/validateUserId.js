const { prisma } = require('../../client.db');

async function validateUserId(circleId, userId) {
    const user = await prisma.users.findUnique({
        where: {
            id: userId,
            circleId: circleId,
            deleted: false
        },
    });

    if (!user) {
        throw new Error('User Id is invalid.');
    }
}

module.exports = { validateUserId }