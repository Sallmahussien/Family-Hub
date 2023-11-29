const joi = require('joi');

class UsersValidator {
    static createUser (userDto) {

        const schema = joi.object({
            id: joi.string(),
            circleId: joi.string().required(),
            firstName: joi.string().trim().min(3).required(),
            lastName: joi.string().trim().min(3).required(),
            role: joi.string().valid('CREATOR', 'MEMEBER').default('MEMEBER'),
            email: joi.string().email().required(),
            password: joi.string().min(6).required(),
            profilePhoto: joi.string().trim(),
            birthdate: joi.date().iso().required(),
            position: joi.string().valid('FATHER', 'MOTHER', 'SON', 'DAUGHTER'),
            deleted: joi.boolean().default(false),
        });

        return schema.validate(userDto);
    }

    static updateUser(userDto) {
        const schema = joi.object({
            id: joi.string().required(),
            circleId: joi.string().required(),
            firstName: joi.string().trim().min(3),
            lastName: joi.string().trim().min(3),
            role: joi.string().valid('CREATOR', 'MEMEBER').default('MEMEBER'),
            email: joi.string().email(),
            password: joi.string().min(6),
            profilePhoto: joi.string().trim(),
            birthdate: joi.date().iso(),
            position: joi.string().valid('FATHER', 'MOTHER', 'SON', 'DAUGHTER'),
            deleted: joi.boolean(),
        });

        return schema.validate(userDto);
    }
}

module.exports = { UsersValidator };