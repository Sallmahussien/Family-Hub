const joi = require('joi');

class ListItem {
    static createListItem (listItemDto) {
        const schema = joi.object({
            id: joi.string(),
            listId: joi.string().required(),
            name: joi.string().trim().min(2).required(),
            deleted: joi.boolean().default(false),
        });

        return schema.validate(listItemDto);
    }  

    static updateListItem (listItemDto) {
        const schema = joi.object({
            id: joi.string().required(),
            listId: joi.string().required(),
            name: joi.string().trim().min(2),
            deleted: joi.boolean()
        });

        return schema.validate(listItemDto);
    }

}

module.exports = { ListItem }