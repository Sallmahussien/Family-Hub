const joi = require('joi');

class EventsValidator {
    static createEvent (eventDto) {
        const schema = joi.object({
            id: joi.string(),
            feedId: joi.string(),
            title: joi.string().min(2).trim().required(),
            startDate: joi.date().required(),
            endDate: joi.date().required(),
            reminder: joi.date(),
            description: joi.string().min(2),
        });
        return schema.validate(eventDto)
    }
    static updateEvent (eventDto) {
        const schema = joi.object({
            id: joi.string().required(),
            feedId: joi.string().required(),
            title: joi.string().min(2).required(),
            startDate: joi.date(),
            endDate: joi.date(),
            reminder: joi.date(),
            description: joi.string().min(2),
        });
        return schema.validate(eventDto)
    }
}

module.exports = { EventsValidator }