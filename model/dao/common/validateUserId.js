const { prisma } = require('../../client.db');

async function validateUserId(circleId, userId) {
    const user = await prisma.users.findFirst({
        where: {
            id: userId,
            circleId: circleId
        },
    });

    if (!user) {
        throw new Error('User Id is invalid.');
    }
}

module.exports = { validateUserId }