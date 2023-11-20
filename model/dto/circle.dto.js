class CirclesDto {
    constructor (bodyRequest) {
        this.id = bodyRequest.id;
        this.name = bodyRequest.name;
        this.coverPhoto = bodyRequest.coverPhoto;
        this.deleted = bodyRequest.deleted;
    }
}

module.exports = { CirclesDto };