const router = require('express').Router();

const { InvitationController } = require('../controllers/inviteUsers.controller')

router.route('/:userId/invite-member').post(InvitationController.inviteNewMember);

module.exports = { router };
