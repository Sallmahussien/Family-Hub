const joi = require('joi');

class CommentsValidator {
    static createComment (commentDto) {
        const schema = joi.object({
            id: joi.string(),
            feedId: joi.string(),
            userId: joi.string().required(),
            content: joi.string().min(2).required(),
            deleted: joi.boolean().default(false),
        });
        return schema.validate(commentDto);
    }

    static updateComment (commentDto) {
        const schema =  joi.object({
            id: joi.string().required(),
            feedId: joi.string().required(),
            userId: joi.string().required(),
            content: joi.string().min(2).required(),
            deleted: joi.boolean()
       });
       return schema.validate(commentDto);
    }
}

module.exports = { CommentsValidator }