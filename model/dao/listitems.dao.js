const { prisma } = require('../client.db');

class ListItemsDao {

    async createListItem (listItemsDto) {
        const listItem = await prisma.listItems.create({
            data: listItemsDto
        });

        return listItem;
    }

    async getListItemsByListId (listItemsDto) {
        const listItems = await prisma.listItems.findMany({
            where: {
                listId: listItemsDto.listId,
                deleted: false
            }
        });

        return listItems;
    }

    async updateListItemById (listItemsDTo) {
        await prisma.listItems.update({
            where: {
                id: listItemsDTo.id
            },
            data: listItemsDTo
        });
    }

    async deleteListItemById (listItemsDTo) {
        await prisma.listItems.update({
            where: {
                id: listItemsDTo.id
            },
            data: {
                deleted: true,
            }
        });
    }

}

module.exports = { ListItemsDao }