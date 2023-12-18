const { prisma } = require('../../client.db');

async function validateListId(listDto) {
    const list = await prisma.lists.findUnique({
        where: {
            id: listDto.id,
        }
    });

    if (!list) throw new Error('List Id is invalide.');

}

module.exports = { validateListId };