const { prisma } = require('../client.db');

class ContactBooksDao {

    async createContactBook (ContactDto) {
        const contactBook = await prisma.contactBooks.create({
            data: ContactDto
        });

        return contactBook;
    };

    async getContactBooksByCircleId (ContactDto) {
        const contactbooks = await prisma.contactBooks.findMany({
            where: {
                circleId: ContactDto.circleId,
                deleted: false
            },
        });

        return contactbooks;
    };

    async getContactBookById (ContactDto) {
        const contactBook = await prisma.contactBooks.findMany({
            where: {
                id: ContactDto.id,
                deleted: false
            },
        });

        return contactBook;
    };


    async updateContactBookById (ContactDto) {
        await prisma.contactBooks.update({
            where: {
                id: ContactDto.id,
                deleted: false
            },
            data: ContactDto
        });
    };

    async deleteContactBookById (ContactDto) {
        await prisma.contactBooks.update({
            where: {
                id: ContactDto.id,
                deleted: false
            },
            data: {
                deleted: true
            }
        });
    };

}


module.exports = { ContactBooksDao }