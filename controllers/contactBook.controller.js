const asyncHandler = require('express-async-handler');

const { ContactBooksDao } = require('../models/dao/contactbook.dao');
const { ContactBooksDto } = require('../models/dto/contactbook.dto');
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
            return res.status(400).json({ message: error.error.details[0].message });
        }
  
        const contactDao = new ContactBooksDao();
        try {
            const contact = await contactDao.createContactBook(contactDto);
            res.status(201).json(contact);
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    /**
     * @desc get contacts by circleId
     * @route /api/v1/circles/:circleId/contactbooks/:contactBookId
     * @method GET
     * @access public
     */
    static getContactsByCircleId = asyncHandler(async (req, res) => {
        const contactDto = new ContactBooksDto(req.body);
        contactDto.circleId = req.params.circleId;

        const contactDao = new ContactBooksDao();

        try {
            const contacts = await contactDao.getContactBooksByCircleId(contactDto);
            res.status(201).json(contacts);
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
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
            const prefixes = ['Circle', 'Contact'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
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
            return res.status(400).json({ message: error.error.details[0].message });
        }

        try {
            await contactDao.updateContactBookById(contactDto);
            res.status(201).json({ message: 'Contact updated successfully' }); ;
        } catch (err) {
            const prefixes = ['Circle', 'Contact'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
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

        const contactDao = new ContactBooksDao();
        try {
            await contactDao.deleteContactBookById(contactDto);
            res.status(201).json({ message: 'Contact deleted successfully' }); ;
        } catch (err) {
            const prefixes = ['Circle', 'Contact'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
        }
    });

}

module.exports = { ContactBooksController }