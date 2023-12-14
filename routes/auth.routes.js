const router = require('express').Router();

const { AuthController } = require('../controllers/auth.controller');

const { upload } = require('../middlewares/uploads');


router
    .route('/signup/:circleId?/:token?')
    .post(upload.single('profilePhoto'), AuthController.register)

router
    .route('/login')
    .post(AuthController.login);

router
    .route('/logout')
    .get(AuthController.logout);


module.exports = { router };
