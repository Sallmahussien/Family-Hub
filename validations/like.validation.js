const joi = require('joi');

class LikesValidator {
    static createLike (likeDto){
        const schema = joi.object({
            id: joi.string(),
            feedId: joi.string(),
            userId: joi.string().required(),
            deleted: joi.boolean().default(false),
        });
        return schema.validate(likeDto)
    }

    static updateLike (likeDto) {
        const schema =  joi.object({
            id: joi.string().required(),
            feedId: joi.string().required(),
            userId: joi.string().required(),
            deleted: joi.boolean(),
        });
        return schema.validate(likeDto)
    }
}
module.exports = { LikesValidator }