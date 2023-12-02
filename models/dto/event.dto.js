class EventsDto {
    constructor(bodyRequest) {
        this.id = bodyRequest.id;
        this.feedId = bodyRequest.feedId;
        this.title = bodyRequest.title;
        this.startDate = bodyRequest.startDate;
        this.endDate = bodyRequest.endDate;
        this.reminder = bodyRequest.reminder;
        this.description = bodyRequest.description;
    }
}

module.exports = { EventsDto };