const joi = require('joi');

class EventsValidator {
    static createEvent (eventDto) {
        const schema = joi.object({
            id: joi.string(),
            feedId: joi.string(),
            title: joi.string().min(2).trim().required(),
            startDate: joi.date().iso().required(),
            endDate: joi.date().iso().required(),
            reminder: joi.date().iso(),
            description: joi.string().min(2),
        });
        return schema.validate(eventDto)
    }
    static updateEvent (eventDto) {
        const schema = joi.object({
            id: joi.string().required(),
            feedId: joi.string().required(),
            title: joi.string().min(2),
            startDate: joi.date().iso(),
            endDate: joi.date().iso(),
            reminder: joi.date().iso(),
            description: joi.string().min(2),
        });
        return schema.validate(eventDto)
    }
}

module.exports = { EventsValidator }