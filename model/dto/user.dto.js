class UsersDto {
    constructor(bodyRequest) {
        this.id = bodyRequest.id;
        this.circleId = bodyRequest.circleId;
        this.firstName = bodyRequest.firstName;
        this.lastName = bodyRequest.lastName;
        this.role = bodyRequest.role;
        this.email = bodyRequest.email;
        this.password = bodyRequest.password;
        this.profilePhoto = bodyRequest.profilePhoto;
        this.birthdate = bodyRequest.birthdate;
        this.position = bodyRequest.position;
        this.deleted = bodyRequest.deleted;
    }
}

module.exports = { UsersDto };