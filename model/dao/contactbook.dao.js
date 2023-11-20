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

    async getContactByContactBookId (ContactDto) {
        const contactbook = await prisma.contactBooks.findMany({
            where: {
                id: ContactDto.id,
                deleted: false
            },
        });

        return contactbook;
    };


    async updateContactById (ContactDto) {
        await prisma.contactBooks.update({
            where: {
                id: ContactDto.id,
                deleted: false
            },
            data: ContactDto
        });
    };

    async deleteContactById (ContactDto) {
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

    async deleteContactsByCircleId (ContactDto) {
        await prisma.contactBooks.updateMany({
            where: {
                circleId: ContactDto.circleId,
                deleted: false
            },
            data: {
                deleted: true
            }
        });
    };
}


module.exports = { ContactBooksDao }