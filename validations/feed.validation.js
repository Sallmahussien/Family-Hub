const joi = require('joi');

class FeedsValidtor {
    static createFeed (feedDto){
        const schema = joi.object({
            id: joi.string(),
            circleId: joi.string().required(),
            userId: joi.string().required(),
            type: joi.string().valid("POST", "POST", "EVENT", "LIST").default("POST"),
            deleted: joi.boolean().default(false),
        });

        return schema.validate(feedDto);

    }
}

module.exports = { FeedsValidtor }