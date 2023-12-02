class ListsDto {
    constructor (bodyRequest) {
        this.id = bodyRequest.id;
        this.feedId = bodyRequest.feedId;
        this.name = bodyRequest.name;
    }
}

module.exports = { ListsDto };