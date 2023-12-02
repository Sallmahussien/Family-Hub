const asyncHandler = require('express-async-handler');

const { CirclesDao } = require('../models/dao/circle.dao');
const { CirclesDto } = require('../models/dto/circle.dto');
const { CircleValidator } = require('../validations/circle.validation');

class CircleController {

    /**
     * @desc create a new circle
     * @route /api/v1/circles
     * @method POST
     * @access public
    */
    static createCircle = asyncHandler(async (req, res) => {
        const circleDto = new CirclesDto(req.body);

        const error = CircleValidator.createCircle(circleDto);
        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }

        const circleDao = new CirclesDao();
        try {
            const circle = await circleDao.createCircle(circleDto);
            res.status(200).json(circle);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    /**
     * @desc get circle by id
     * @route /api/v1/circles/:circleId
     * @method GET
     * @access public
    */
    static getCirleById = asyncHandler(async (req, res) => {
        const circleDto = new CirclesDto(req.body);
        circleDto.id = req.params.circleId;

        const circleDao = new CirclesDao();
        try {
            const circle = await circleDao.getCirleById(circleDto);
            res.status(200).json(circle);
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
        }

    });

    /**
     * @desc update circle by id
     * @route /api/v1/circles/:circleId
     * @method PUT
     * @access public
    */
    static updateCircle = asyncHandler(async (req, res) => {
        const circleDto = new CirclesDto(req.body);
        circleDto.id = req.params.circleId;

        const error = CircleValidator.updateCircle(circleDto);
        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }

        const circleDao = new CirclesDao();
        try {
            await circleDao.updateCircle(circleDto);
            res.status(200).json({ message: 'Circle is updated.'});
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
        }
    });

    /**
     * @desc delete circle by id
     * @route /api/v1/circles/:circleId
     * @method DELETE
     * @access public
    */
    static deleteCircleById = asyncHandler(async (req, res) => {
        const circleDto = new CirclesDto(req.body);
        circleDto.id = req.params.circleId;

        const circleDao = new CirclesDao();
        try {
            await circleDao.deleteCircleById(circleDto);
            res.status(200).json({ message: 'Circle is deleted.'});
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') {
                res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: err.message });
        }
    });


}

module.exports = { CircleController };