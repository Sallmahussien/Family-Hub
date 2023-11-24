const { parse, isValid, format } = require('date-fns');

class EventsDto {
    constructor(bodyRequest) {
        this.id = bodyRequest.id;
        this.feedId = bodyRequest.feedId;
        this.title = bodyRequest.title;
        this.startDate = this.formatDate(bodyRequest.startDate)? this.formatDate(bodyRequest.startDate): bodyRequest.startDate ;
        this.endDate = this.formatDate(bodyRequest.endDate)? this.formatDate(bodyRequest.endDate): bodyRequest.endDate;
        this.reminder = bodyRequest.reminder;
        this.description = bodyRequest.description;
    }

    formatDate(dateString) {
        if (!dateString) {
            return null;
        }
        const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());

        if (!isValid(parsedDate)) {
            throw new Error(`Invalid date format: ${dateString}`);
        }

        const isoDateString = format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { timeZone: 'UTC' });

        return isoDateString;
    }
}

module.exports = { EventsDto };