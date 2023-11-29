const joi = require('joi');

class CircleValidator {

    static createCircle(circleDto) {
        const schema = joi.object({
            id: joi.string(),
            name: joi.string().trim().min(3).required(),
            coverPhoto: joi.string().trim().min(3),
            deleted: joi.boolean().default(false),
        });

        return schema.validate(circleDto);
    }

    static updateCircle(circleDto) {
        const schema = joi.object({
            id: joi.string().required(),
            name: joi.string().trim().min(3),
            coverPhoto: joi.string().trim().min(3),
            deleted: joi.boolean().default(false),
        });

        return schema.validate(circleDto);
    }

}

module.exports = { CircleValidator };