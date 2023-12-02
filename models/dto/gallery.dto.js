class GalleryDto {
    constructor (bodyRequest) {
        this.id = bodyRequest.id;
        this.feedId = bodyRequest.feedId;
        this.photo = bodyRequest.photo;
        this.caption = bodyRequest.caption;
    }
}

module.exports = { GalleryDto };