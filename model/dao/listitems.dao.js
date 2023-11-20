const { prisma } = require('../client.db');
const { ListsDao } = require('./list.dao');
const List = new ListsDao();

class ListItemsDao {

    async createListItem (listItemsDto) {
        const listItem = await prisma.listItems.create({
            data: listItemsDto
        });

        return listItem;
    }

    async getAllListItems (listId) {
        const listIems = await prisma.listItems.findMany({
            where: {
                listId: listId
            }
        });

        return listIems;
    }

    async updateListItemById (listItemsDTo) {

        await prisma.listItems.update({
            where: {
                id: listItemsDTo.id
            },
            data: listItemsDTo
        });
    }

}

module.exports = { ListItemsDao }