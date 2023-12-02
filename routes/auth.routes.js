const router = require('express').Router();

const { AuthController } = require('../controllers/auth.controller');


router
    .route('/signup/:circleId?/:token?')
    .post(AuthController.register)

router
    .route('/login')
    .post(AuthController.login);


module.exports = { router };
