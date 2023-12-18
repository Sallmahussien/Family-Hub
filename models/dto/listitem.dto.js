class ListItemsDto {
    constructor (bodyRequest) {
        this.id = bodyRequest.id;
        this.listId = bodyRequest.listId;
        this.name = bodyRequest.name;
        this.checked = bodyRequest.checked;
        this.deleted = bodyRequest.deleted;
    }
}

module.exports = { ListItemsDto };