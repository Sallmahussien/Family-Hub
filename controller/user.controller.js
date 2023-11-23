const asyncHandler = require('express-async-handler');

const { UsersDao } = require('../model/dao/user.dao');
const { UsersDto } = require('../model/dto/user.dto');
const { UsersValidator } = require('../validations/user.validation');

class UsersController {

    /**
     * @desc create a new user
     * @route /api/v1/circles/<circle_id>/users
     * @method POST
     * @access public
     */
    static createUser = asyncHandler(async (req, res) => {

        const userDto = new UsersDto(req.body);
        userDto.circleId = req.params.circleId;
        const error = UsersValidator.createUser(userDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }
        
        const userDao = new UsersDao();
        try {
            const user = await userDao.createUser(userDto);
            res.status(201).json(user);
        } catch (err) {
            if (err.message === 'Email is already in use.') {
                return res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    /**
     * @desc get users by circleId
     * @route /api/v1/circles/<circle_id>/users
     * @method GET
     * @access public
     */
    static getUsersByCircleId = asyncHandler(async (req, res) => {
        const userDto = new UsersDto(req.body);
        userDto.circleId = req.params.circleId;

        const userDao = new UsersDao();
        const users = await userDao.getUsersByCircleId(userDto);

        if (users.length == 0) res.status(404).json({ message: 'Invalide Circle id' });
        res.status(200).json(users);                    
    });

    /**
     * @desc get user by Id
     * @route /api/v1/circles/<circle_id>/users
     * @method GET
     * @access public
     */
    static getUsersById = asyncHandler(async (req, res) => {
        const userDto = new UsersDto(req.body);
        userDto.circleId = req.params.circleId;
        userDto.id = req.params.userId;
    
        const userDao = new UsersDao();
        try {
            const user = await userDao.getUserById(userDto);
            if (!user) res.status(400).json({ message: 'User Id is invalid.'});
            res.status(200).json(user);
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                return res.status(409).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });

    /**
     * @desc update user by id
     * @route /api/v1/circles/<circle_id>/users
     * @method PUT
     * @access public
     */
    static updateUserById = asyncHandler(async (req, res) => {
        const userDto = new UsersDto(req.body);
        userDto.circleId = req.params.circleId;
        userDto.id = req.params.userId;
        const error = UsersValidator.updateUser(userDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }

        const userDao = new UsersDao();
        try {
            await userDao.updateUserById(userDto);
            res.status(201).json({ message: 'User updated successfully' }); ;
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            } else if (err.code === 'P2025' && err.meta?.cause === 'Record to update not found.') {
                res.status(409).json({ message: 'User Id is invalid.' });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });

    /**
     * @desc delete user by id
     * @route /api/v1/circles/<circle_id>/users
     * @method DELETE
     * @access public
     */
    static deleteUserById = asyncHandler(async (req, res) => {
        const userDto = new UsersDto(req.body);
        userDto.circleId = req.params.circleId;
        userDto.id = req.params.userId;
        const error = UsersValidator.updateUser(userDto);

        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }

        const userDao = new UsersDao();
        try {
            await userDao.deleteUserById(userDto);
            res.status(201).json({ message: 'User deleted successfully' }); ;
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            } else if (err.code === 'P2025' && err.meta?.cause === 'Record to update not found.') {
                res.status(409).json({ message: 'User Id is invalid.' });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });



}

module.exports = { UsersController };