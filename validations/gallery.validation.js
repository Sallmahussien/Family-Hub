const joi = require('joi');

class GalleryValidator {
    static createGallery(galleryDto) {
        const schema = joi.object({
            id: joi.string(),
            feedId: joi.string(),
            caption: joi.string().min(2),
            photo: joi.string().trim().min(2).required(),
        });

        return schema.validate(galleryDto);
    }

    static updateGallery(galleryDto) {
        const schema = joi.object({
            id: joi.string().required(),
            feedId: joi.string().required(),
            caption: joi.string().min(2),
            photo: joi.string().trim().min(2),
        });

        return schema.validate(galleryDto);
    }
}

module.exports = { GalleryValidator };