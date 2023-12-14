const router = require('express').Router();
const { UsersController } = require('../controllers/user.controller');

router.route('/validate-email').post(UsersController.validateUserEmail);

module.exports = { router };