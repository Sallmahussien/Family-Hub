const { prisma } = require('../client.db');
const { validateCircleId } = require('./common/validateCircleId');

class ContactBooksDao {

    async createContactBook(contactDto) {
        await validateCircleId(contactDto.circleId);

        const contactBook = await prisma.contactBooks.create({
            data: contactDto
        });

        return contactBook;
    };

    async getContactBooksByCircleId(contactDto) {
        await validateCircleId(contactDto.circleId);

        const contactbooks = await prisma.contactBooks.findMany({
            where: {
                circleId: contactDto.circleId,
                deleted: false
            },
        });

        return contactbooks;
    };

    async getContactBookById(contactDto) {
        await validateCircleId(contactDto.circleId);
        await this.validateContactBookById(contactDto);

        const contactBook = await prisma.contactBooks.findUnique({
            where: {
                id: contactDto.id,
                deleted: false
            },
        });

        return contactBook;
    };


    async updateContactBookById(contactDto) {
        await validateCircleId(contactDto.circleId);
        await this.validateContactBookById(contactDto);

        await prisma.contactBooks.update({
            where: {
                id: contactDto.id,
                deleted: false
            },
            data: contactDto
        });
    };

    async deleteContactBookById(contactDto) {
        await validateCircleId(contactDto.circleId);
        await this.validateContactBookById(contactDto);

        await prisma.contactBooks.update({
            where: {
                id: contactDto.id,
                deleted: false
            },
            data: {
                deleted: true
            }
        });
    };

    async validateContactBookById(contactDto) {
        const contactBook = await prisma.contactBooks.findUnique({
            where: {
                id: contactDto.id,
                circleId: contactDto.circleId,
                deleted: false,
            }
        });

        if (!contactBook) throw Error('Contact Book Id is invalid');
    }

}


module.exports = { ContactBooksDao }