const router = require('express').Router();

const { UsersController } = require('../controllers/user.controller');
const { InvitationController } = require('../controllers/inviteUsers.controller');
const { verifyToken, verifyTokenAndAuthorization } = require('../middlewares/verifyToken');


router
    .route('/:circleId/users/')
    .get(verifyToken, UsersController.getUsersByCircleId)


router
    .route('/users/:userId/invite-member')
    .post(InvitationController.inviteNewMember)


router
    .route('/:circleId/users/:userId/')
    .get(verifyToken, UsersController.getUsersById)
    .put(verifyTokenAndAuthorization, UsersController.updateUserById)
    .delete(verifyTokenAndAuthorization, UsersController.deleteUserById);


module.exports = { router };
