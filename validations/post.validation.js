const joi = require('joi');

class PostsValidator {
    static createPost (postDto) {
        const schema = joi.object({
            id: joi.string(),
            feedId: joi.string(),
            content: joi.string().min(2).required(),
        });

        return schema.validate(postDto)
    }


    static updatePost (postDto) {
        const schema = joi.object({
            id: joi.string().required(),
            feedId: joi.string().required(),
            content: joi.string().min(2).required(),
        });

        return schema.validate(postDto)
    }
}

module.exports = { PostsValidator }