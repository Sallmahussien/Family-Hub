class CommentsDto {
    constructor (bodyRequest) {
        this.id = bodyRequest.id;
        this.feedId = bodyRequest.feedId;
        this.userId = bodyRequest.userId;
        this.content = bodyRequest.content;
        this.deleted = bodyRequest.deleted;
    }
}

module.exports = { CommentsDto };