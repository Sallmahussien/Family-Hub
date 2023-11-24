const asyncHandler = require('express-async-handler');

const { ContactBooksDao } = require('../model/dao/contactbook.dao');
const { ContactBooksDto } = require('../model/dto/contactbook.dto');
const { ContactBooksValidator } = require('../validations/contactBook.validation');

class ContactBooksController {

     /**
     * @desc create a new contactbook
     * @route /api/v1/circles/:circleId/contactbooks
     * @method POST
     * @access public
     */
     static createContact = asyncHandler(async (req, res) => {

        const contactDto = new ContactBooksDto(req.body);
        contactDto.circleId = req.params.circleId;

        const error = ContactBooksValidator.createContactBook(contactDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }
        
        const contactDao = new ContactBooksDao();
        try {
            const contact = await contactDao.createContactBook(contactDto);
            res.status(201).json(contact);
        } catch (err) {
            const prefixes = ['Circle', 'Contact'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
                res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    /**
     * @desc get contacts by circleId
     * @route /api/v1/circles/:circleId/contactbooks
     * @method GET
     * @access public
     */
    static getContactsByCircleId = asyncHandler(async (req, res) => {
        const contactDto = new ContactBooksDto(req.body);
        contactDto.circleId = req.params.circleId;

        const contactDao = new ContactBooksDao();
        const contacts = await contactDao.getContactBooksByCircleId(contactDto);

        if (contacts.length == 0) res.status(404).json({ message: 'Invalide Circle id' });
        res.status(200).json(contacts);                    
    });

    /**
     * @desc get contact by Id
     * @route /api/v1/circles/:circleId/contactbooks/:contactId
     * @method GET
     * @access public
     */
    static getContactById = asyncHandler(async (req, res) => {
        const contactDto = new ContactBooksDto(req.body);
        contactDto.circleId = req.params.circleId;
        contactDto.id = req.params.contactId;
    
        const contactDao = new ContactBooksDao();
        try {
            const contact = await contactDao.getContactBookById(contactDto);
            if (!contact) res.status(400).json({ message: 'Contact Id is invalid.'});
            res.status(200).json(contact);
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                return res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });

    /**
     * @desc update contact by id
     * @route /api/v1/circles/:circleId/contactbooks/:contactId
     * @method PUT
     * @access public
     */
    static updateContactById = asyncHandler(async (req, res) => {
        const contactDto = new ContactBooksDto(req.body);
        contactDto.circleId = req.params.circleId;
        contactDto.id = req.params.contactId;
        const contactDao = new ContactBooksDao();
        const error = ContactBooksValidator.updateContactBook(contactDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }

        try {
            await contactDao.updateContactBookById(contactDto);
            res.status(201).json({ message: 'Contact updated successfully' }); ;
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            } else if (err.code === 'P2025' && err.meta?.cause === 'Record to update not found.') {
                res.status(409).json({ message: 'Contact Id is invalid.' });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });

    /**
     * @desc delete contact by id
     * @route /api/v1/circles/:circleId/contactbooks/:contactId
     * @method DELETE
     * @access public
     */
    static deleteContactById = asyncHandler(async (req, res) => {
        const contactDto = new ContactBooksDto(req.body);
        contactDto.circleId = req.params.circleId;
        contactDto.id = req.params.contactId;
        const error = ContactBooksValidator.updateContactBook(contactDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }

        const contactDao = new ContactBooksDao();
        try {
            await contactDao.deleteContactBookById(contactDto);
            res.status(201).json({ message: 'User deleted successfully' }); ;
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            } else if (err.code === 'P2025' && err.meta?.cause === 'Record to update not found.') {
                res.status(409).json({ message: 'User Id is invalid.' });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });

}

module.exports = { ContactBooksController }