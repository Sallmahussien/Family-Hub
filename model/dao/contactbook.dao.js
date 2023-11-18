const { prisma } = require('../client.db');

class ContactBooksDao {

    async createContactBook (CreateContactDto) {
        const contactBook = await prisma.contactBooks.create({
            data: CreateContactDto
        });

        return contactBook;
    };

    async getContactBooksByCircleId (circleId) {
        const contactbooks = await prisma.contactBooks.findMany({
            where: {
                circleId: circleId,
                deleted: false
            },
        });

        return contactbooks;
    };

    async getContactByContactBookId (contactId) {
        const contactbook = await prisma.contactBooks.findMany({
            where: {
                id: contactId,
                deleted: false
            },
        });

        return contactbook;
    };


    async updateContactById (contactId, UpdateContactDto) {
        await prisma.contactBooks.update({
            where: {
                id: contactId,
                deleted: false
            },
            data: UpdateContactDto
        });
    };

    async deleteContactById (contactId) {
        await prisma.contactBooks.update({
            where: {
                id: contactId,
                deleted: false
            },
            data: {
                deleted: true
            }
        });
    };

    async deleteAllContactsByCircleId (circleId) {
        await prisma.contactBooks.updateMany({
            where: {
                circleId: circleId,
                deleted: false
            },
            data: {
                deleted: true
            }
        });
    };
}


module.exports = { ContactBooksDao }