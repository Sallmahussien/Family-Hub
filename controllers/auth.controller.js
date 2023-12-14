const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { UsersDao } = require('../models/dao/user.dao');
const { UsersDto } = require('../models/dto/user.dto');
const { UsersValidator } = require('../validations/user.validation');


class AuthController {

  static createToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '3d' });
  };

  /**
   * @desc register
   * @route /api/v1/auth/signup
   * @method POST
   * @access public
   */
  static register = asyncHandler(async (req, res) => {

    const userDto = new UsersDto(req.body);
    const error = UsersValidator.createUser(userDto);

    if (req.file) {
      userDto.profilePhoto = req.file.filename;
    }

    if (error && error.error && error.error.details && error.error.details[0]) {
      return res.status(400).json({ message: error.error.details[0].message });
    }

    const userDao = new UsersDao();
    try {
      const user = await userDao.createUser(userDto);
      const token = AuthController.createToken(user);
      const { password, ...other } = user;
      res.status(201).json({ ...other, token });
    } catch (err) {
      if (err.message === 'Email is already in use.') {
        return res.status(409).json({ message: err.message });
      }
      res.status(500).json({ message: err.message });
    }
  });

  /**
   * @desc login
   * @route /api/v1/auth/login
   * @method POST
   * @access public
   */
  static login = asyncHandler(async (req, res) => {
    const userDto = new UsersDto(req.body);
    const error = UsersValidator.login(userDto);

    if (error && error.error && error.error.details && error.error.details[0]) {
      return res.status(400).json({message: error.error.details[0].message});
    }

    const userDao = new UsersDao();
    try {
      const user = await userDao.getUserByEmail(userDto);
      const isPassword = bcrypt.compareSync(userDto.password, user.password);
      if (!isPassword) {
        throw new Error('Invalid email or password.');
      }

      const token = AuthController.createToken(user);
      const {password, ...other} = user;
      res.status(200).json({...other, token});
    } catch (err) {
      if (err.message === 'Invalid email or password.') {
        return res.status(401).json({message: err.message});
      }
      res.status(500).json({message: err.message});
    }
  });

  static logout = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  });
}


module.exports = { AuthController };
