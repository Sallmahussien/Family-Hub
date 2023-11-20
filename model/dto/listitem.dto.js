class ListItemsDto {
    constructor (bodyRequest) {
        this.id = bodyRequest.id;
        this.listId = bodyRequest.listId;
        this.name = bodyRequest.name;
        this.deleted = bodyRequest.deleted;
    }
}

module.exports = { ListItemsDto };