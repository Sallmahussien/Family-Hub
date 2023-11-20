class ContactBooksDto {
    constructor (bodyRequest) {
        this.id = bodyRequest.id;
        this.circleId = bodyRequest.circleId;
        this.firstName = bodyRequest.firstName;
        this.lastName = bodyRequest.lastName;
        this.email = bodyRequest.email;
        this.phoneNumber = bodyRequest.phoneNumber;
        this.profilePhoto = bodyRequest.profilePhoto;
        this.type = bodyRequest.type;
        this.note = bodyRequest.note;
        this.deleted = bodyRequest.deleted;
    }
}

module.exports = { ContactBooksDto };