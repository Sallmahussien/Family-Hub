class PostsDto {
    constructor (bodyRequest) {
        this.id = bodyRequest.id;
        this.feedId = bodyRequest.feedId;
        this.content = bodyRequest.content;
    }
}

module.exports = { PostsDto };