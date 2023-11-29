const joi = require('joi');

class ContactBooksValidator {
    static createContactBook (contactDto) {

        const schema = joi.object({
            id: joi.string(),
            circleId: joi.string().required(),
            firstName: joi.string().trim().min(3).required(),
            lastName: joi.string().trim().min(3).required(),
            email: joi.string().email(),
            phoneNumber: joi.string().min(10).required(),
            profilePhoto: joi.string().trim(),
            type: joi.string().min(2).trim(),
            note: joi.string().min(2).trim(),
            deleted: joi.boolean().default(false),
    });
        return schema.validate(contactDto)
    }

    static updateContactBook (contactDto) {
        const schema =  joi.object({
            id: joi.string().required(),
            circleId: joi.string().required(),
            firstName: joi.string().trim().min(3),
            lastName: joi.string().trim().min(3),
            email: joi.string().email(),
            phoneNumber: joi.string().min(10),
            profilePhoto: joi.string().trim(),
            type: joi.string().min(2).trim(),
            note: joi.string().min(2).trim(),
            deleted: joi.boolean()
    });
        return schema.validate(contactDto)

}
}

module.exports = { ContactBooksValidator }