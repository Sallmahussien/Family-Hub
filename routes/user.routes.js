const express = require('express');

const { UsersController } = require('../controller/user.controller');

const router = express.Router();

/**
 * @desc create a new user
 * @route /api/v1/circles/<circle_id>/users
 * @method POST
 * @access public
 */
router.post('/:circleId/users', UsersController.createUser);

/**
 * @desc get users by circleId
 * @route /api/v1/circles/<circle_id>/users
 * @method GET
 * @access public
 */
router.get('/:circleId/users', UsersController.getUsersByCircleId);

/**
 * @desc get user by Id
 * @route /api/v1/circles/<circle_id>/users
 * @method GET
 * @access public
 */
router.get('/:circleId/users/:userId', UsersController.getUsersById);

/**
 * @desc update user by id
 * @route /api/v1/circles/<circle_id>/users
 * @method PUT
 * @access public
 */
router.put('/:circleId/users/:userId', UsersController.updateUserById);

/**
 * @desc delete user by id
 * @route /api/v1/circles/<circle_id>/users
 * @method DELETE
 * @access public
 */
router.delete('/:circleId/users/:userId', UsersController.deleteUserById);

module.exports = { router };
