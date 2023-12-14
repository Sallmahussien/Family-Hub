const asyncHandler = require('express-async-handler');
const fs = require('fs').promises;
const path = require('path');

const { UsersDao } = require('../models/dao/user.dao');
const { UsersDto } = require('../models/dto/user.dto');
const { UsersValidator } = require('../validations/user.validation');

class UsersController {
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

        const userDao = new UsersDao();

        if (req.file) {
            try {
                const user = await userDao.getUserById(userDto);
                if (user.profilePhoto) {
                    const filePath = path.join(__dirname, `../images/${user.profilePhoto}`);
                    await fs.unlink(filePath);
                }
            } catch(err) {
                if (err.message === 'User Id is invalid.') return res.status(404).json({ message: err.message });
            }

            userDto.profilePhoto = req.file.filename;
        }

        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }

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
                return res.status(409).json({ message: err.message });
            } else if (err.code === 'P2025' && err.meta?.cause === 'Record to update not found.') {
                return res.status(409).json({ message: 'User Id is invalid.' });
            }
            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });

    static validateUserEmail = asyncHandler(async (req, res) => {
        const userDto = new UsersDto(req.body);

        const userDao = new UsersDao();
        try {
            const user = await userDao.getUserByEmail(userDto);
            console.log(user)
            res.status(200).json({ message: "This Email already has an acount" }); ;
        } catch (err) {
            if (err.message === 'Invalid email or password.') {
                return res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: 'Internal Server Error' });   
        }
    });
}

module.exports = { UsersController };