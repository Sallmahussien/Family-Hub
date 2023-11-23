const asyncHandler = require('express-async-handler');

const { ListsDao } = require('../model/dao/list.dao')
const { ListsDto } = require('../model/dto/list.dto')
const { FeedsDto } = require('../model/dto/feed.dto');
const { ListsValidator } = require('../validations/list.validation');


class ListsController {

    /**
     * @desc create a new list
     * @route /api/v1/circles/:circle_id/users/:userId/lists
     * @method POST
     * @access public
     */
    static createList = asyncHandler(async (req, res) => {
        const feedDto =  new FeedsDto({
            circleId: req.params.circleId,
            userId: req.params.userId
        });

        const listDto = new ListsDto(req.body);

        const error = ListsValidator.createList(listDto);
        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }

        const listDao = new ListsDao();
        try {
            const list = await listDao.createList(listDto, feedDto);
            res.status(201).json(list);
        } catch (err) {
            const prefixes = ['Circle', 'User'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
                res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: 'Internal Server Error' });
        } 
    });

    /**
     * @desc get all lists by circle id
     * @route /api/v1/circles/:circleId/lists/
     * @method GET
     * @access public
     */
    static getListsByCircleId = asyncHandler(async (req, res) => {
        const listDto = new ListsDto(req.body);
        listDto.circleId = req.params.circleId;

        const listDao = new ListsDao();

        try {
            const lists = await listDao.getListsByCircleId(listDto);
            res.status(200).json(lists);  
        } catch (err) {
            if (err.message === 'Circle Id is invalid.') res.status(404).json({ message: err.message});

            res.status(500).json({ message: 'Internal Server Error' });
        } 
    });

    /**
     * @desc get list by id
     * @route /api/v1/circles/:circleId/users/:userId/feeds/:feedId/lists/:listId
     * @method GET
     * @access public
     */
    static getListById = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto({ 
            id: req.params.feedId,
            circleId: req.params.circleId,
            userId: req.params.userId,
        });

        const listDto = new ListsDto(req.body);
        listDto.feedId = req.params.feedId;
        listDto.id = req.params.listId;

        const listDao = new ListsDao();
        try {
            const list = await listDao.getListById(listDto, feedDto);
            res.status(200).json(list);  
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'List'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: 'Internal Server Error' });   
        } 

    });

    /**
     * @desc update list by id
     * @route /api/v1/circles/:circleId/users/:userId/feeds/:feedId/lists/:listId
     * @method PUT
     * @access public
     */
    static updateListById = asyncHandler(async (req, res) => {
        const feedDto = new FeedsDto({ 
            id: req.params.feedId,
            circleId: req.params.circleId,
            userId: req.params.userId,
        });

        const listDto = new ListsDto(req.body);
        listDto.feedId = req.params.feedId;
        listDto.id = req.params.listId;

        const error = ListsValidator.updateList(listDto);
        if (error && error.error && error.error.details && error.error.details[0]) {
            res.status(400).json({ message: error.error.details[0].message });
        }

        const listDao = new ListsDao();
        try {
            await listDao.updateListById(listDto, feedDto);
            res.status(200).json({ message: 'List updated successfully.'});  
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'List'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
              res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: 'Internal Server Error' });   
        } 
    });
}

module.exports = { ListsController };