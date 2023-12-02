const router = require('express').Router();
const { PasswordController} = require('../controllers/password.controller');
const { verifyToken } = require('../middlewares/verifyToken');


router
    .route('/forget-password')
    .get(PasswordController.getForgotPasswordView)
    .post(PasswordController.forgetPassword)

router
    .route('/reset-password/:userId/:token')
    .get(PasswordController.resetPasswordView)
    .post(PasswordController.resetPassword)

router
    .route('/change-password/:userId')
    .post(verifyToken, PasswordController.changePassword)

module.exports = { router }