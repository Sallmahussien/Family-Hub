class LikesDto {
    constructor (bodyRequest) {
        this.id = bodyRequest.id;
        this.feedId = bodyRequest.feedId;
        this.userId = bodyRequest.userId;
        this.deleted = bodyRequest.deleted;
    }
}

module.exports = { LikesDto };