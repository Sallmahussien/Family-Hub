const joi = require('joi');

class ListsValidator {
    static createList (listDto) {
        const schema = joi.object({
            id: joi.string(),
            feedId: joi.string(),
            name: joi.string().trim().min(2).required(),
        });

        return schema.validate(listDto);
    }  

    static updateList (listDto) {
        const schema = joi.object({
            id: joi.string().required(),
            feedId: joi.string().required(),
            name: joi.string().trim().min(2),
        });

        return schema.validate(listDto);
    }
}

module.exports = { ListsValidator }