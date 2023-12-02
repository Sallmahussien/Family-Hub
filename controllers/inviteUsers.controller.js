const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
require('dotenv').config();
const nodemailer = require("nodemailer");

const { UsersDao } = require('../models/dao/user.dao');
const { UsersValidator } = require('../validations/user.validation');

class InvitationController {

    /**
     * @desc    Invite new member to a circle
     * @route   /users/:userId/invite-member
     * @method  POST
     * @access  public
     */
    static inviteNewMember =  asyncHandler(async (req, res) => {
        const userDao = new UsersDao();

        
        try {
            const existingUser = await userDao.getUserByEmail({ email: req.body.email});
            return res.status(400).json({ message: "User Already Registered" });

        } catch (err) {
            const user = await userDao.getUserById({ id: req.params.userId })
            const { error } = await UsersValidator.inviteMember({ email: req.body.email });
            
            if (error && error.error && error.error.details && error.error.details[0]) {
                return res.status(400).json({ message: error.error.details[0].message });
            }

            const secret = process.env.TOKEN_SECRET;
            const token = jwt.sign({ email: req.body.email }, 
                                    secret,
                                    { expiresIn: "15m",}
                                );
            const link = `http://localhost:5000/api/v1/auth/signup/${user.circleId}/${token}`;

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: user.email,
                    pass: user.password,
                }
            });
            const mailOptions = {
                from: user.email,
                to: req.body.email,
                subject: "You're Invited To Join My Circle on FamilyHub",
                html: `<div>
                        <h4>Hey Iam ${user.firstName}! Iam inviting you to join my circle on FamilyHub</h4>
                        <h6> click the link</h6>
                        <p>${link}</p>
                    </div>`
            };
            transporter.sendMail(mailOptions, function(error, success){
                if (error) {
                    console.log(error);
                    res.status(500).json({message: "something went wrong"});
                } else {
                    console.log("Email sent: " + success.response);
                }
            });
        }
    });
}

module.exports = {
    InvitationController
}