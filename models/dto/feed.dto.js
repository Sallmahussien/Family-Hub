class FeedsDto {
    constructor (bodyRequest) {
        this.id = bodyRequest.id;
        this.circleId = bodyRequest.circleId;
        this.userId = bodyRequest.userId;
        this.type = bodyRequest.type;
        this.deleted = bodyRequest.deleted;
    }
}

module.exports = { FeedsDto };