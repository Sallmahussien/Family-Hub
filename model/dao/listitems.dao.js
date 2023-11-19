const { prisma } = require('../client.db');
const { ListsDao } = require('./list.dao');
const List = new ListsDao();

class ListItemsDao {

    async createListItem (createListItemsDTO) {
        const listItem = await prisma.listItems.create({
            data: createListItemsDTO
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

    async updateListItemById (itemIde, updateListItemDTO) {

        await prisma.listItems.update({
            where: {
                id: itemIde
            },
            data: updateListItemDTO
        });
    }

}

module.exports = { ListItemsDao }