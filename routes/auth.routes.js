const router = require('express').Router();

const { AuthController } = require('../controllers/auth.controller');

const { upload } = require('../middlewares/uploads');


router
    .route('/signup/:circleId?/:token?')
    .post(upload.single('profilePhoto'), AuthController.register)

router
    .route('/login')
    .post(AuthController.login);


module.exports = { router };
