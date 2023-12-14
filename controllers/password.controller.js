const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const nodemailer = require("nodemailer");

const { UsersDao } = require('../models/dao/user.dao');
const { UsersDto } = require('../models/dto/user.dto');
const { UsersValidator } = require('../validations/user.validation');


class PasswordController {

    /**
     * @desc    send a forget password request
     * @route   /forget-password
     * @method  GET
     * @access  public
     */
    static getForgotPasswordView = asyncHandler((req, res) => {
        res.render("forgot-password");
    });


    /**
     * @desc    send a forget password request
     * @route   /forget-password
     * @method  POST
     * @access  public
     */
    static forgetPassword = asyncHandler(async (req, res) => {
        const userDto = new UsersDto(req.body);
        const userDao = new UsersDao();

        console.log(req.body)

        const error = UsersValidator.forgrtPassword(userDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }

        try {
            const user = await userDao.getUserByEmail(userDto);

            const secret = process.env.TOKEN_SECRET + user.password;
            const token = jwt.sign({ email: user.email, id: user.id }, 
                                    secret,
                                    { expiresIn: "15m",}
                                );

            const link = `http://localhost:3000/api/v1/password/reset-password/${user.id}/${token}`;
      
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASS,
                }
            });
            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: user.email,
                subject: "Reset Password",
                html: `<div>
                        <h4>Hey ${user.firstName}! Click on the link below to reset your password</h4>
                        <p>${link}</p>
                    </div>`
            }
            
            transporter.sendMail(mailOptions, function(error, success){
                if (error) {
                    console.log(error);
                    res.status(500).json({message: "something went wrong"});
                } else {
                    console.log("Email sent: " + success.response);
                    res.status(201).json({ message: 'mail is sent' })
                }
            });

        } catch (err) {
            if (err.message === 'Invalid email or password.') {
                return res.status(409).json({ message: 'Invalide email address'});
            }
            return res.status(500).json({ message: err.message });
        }
      
    });

    
    /**
     * @desc    reset the password
     * @route   /reset-password/:userId/:token
     * @method  GET
     * @access  public
     */
    static resetPasswordView = asyncHandler(async (req, res) => {
        const userDto = new UsersDto(req.body);
        const userDao = new UsersDao();

        userDto.id = req.params.userId;

        try {
            const user = await userDao.getUserById(userDto);
            const secret = process.env.TOKEN_SECRET + user.password;

            jwt.verify(req.params.token, secret);
            res.render("reset-password", { email: user.email });

        }
        catch (err) {
            return res.status(404).json({ message: err.message });
        }

    });
      

    /**
     * @desc    reset password request
     * @route   /reset-password/:userId/:token
     * @method  POST
     * @access  public
     */
    static resetPassword = asyncHandler(async (req, res) => {
        const userDto = new UsersDto(req.body);

        userDto.id = req.params.userId;

        const { error } = UsersValidator.changePass(userDto);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userDao = new UsersDao();

        try {
            const user = await userDao.getUserById(userDto);

            const secret = process.env.TOKEN_SECRET + user.password;
            jwt.verify(req.params.token, secret);

            await userDao.updateUserById(userDto);

            res.status(201).json({ message: 'Password is updated' });
        } catch (error) {
            return res.status(404).json({ message: err.message });
        }
    });

    /**
     * @desc    change password
     * @route   /change-password/:userId/
     * @method  POST
     * @access  public
     */
    static changePassword = asyncHandler(async (req, res) => {

        const userDto = new UsersDto(req.body);
        const currPassword = req.body.password;
        const newPassword = req.body.newPassword;
        userDto.id = req.params.userId;

        const userDao = new UsersDao();

        try {
            const user = await userDao.getUserById(userDto);

            const isPassword = await bcrypt.compare(currPassword, user.password);
            if (isPassword) {
                const { error } = await UsersValidator.changePass({ password: newPassword });
                if (error && error.error && error.error.details && error.error.details[0]) {
                    return res.status(400).json({ message: error.error.details[0].message });
                }
                userDto.password = newPassword;
                await userDao.updateUserById(userDto)
                return res.status(201).json({ message: "Password Changed Successfully!" })
            }

            return res.status(404).json({ message: "Incorrect Password" })

        } catch (err) {
            return res.status(409).json({ message: err.message });
        }

    });

}

module.exports = { PasswordController }
