const asyncHandler = require('express-async-handler');

const { ListItemsDao } = require('../models/dao/listitems.dao');
const { ListItemsDto } = require('../models/dto/listitem.dto');
const { ListsDto } = require('../models/dto/list.dto');
const { FeedsDto } = require('../models/dto/feed.dto');
const { ListItemValidator } = require('../validations/listitem.validation');

const { validateCircleId } = require('../models/dao/common/validateCircleId');
const { validateUserId } = require('../models/dao/common/validateUserId');
const { validateFeedId } = require('../models/dao/common/validateFeedId');
const { validateListId } = require('../models/dao/common/validateListId');

class ListItemsController {

    /**
     * @desc create a new listItem
     * @route /api/v1/circles/:circle_id/users/:userId/feeds/:feedId/lists/:listId/listItems
     * @method POST
     * @access public
    */
    static createListItem = asyncHandler(async (req, res) => {
        const feedDto =  new FeedsDto({
            id: req.params.feedId,
            circleId: req.params.circleId,
            userId: req.params.userId
        });
        const listDto = new ListsDto({
            id: req.params.listId,
        });

        const listItemDto = new ListItemsDto(req.body);
        listItemDto.listId = req.params.listId

        const error = ListItemValidator.createListItem(listItemDto);
        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }

        const listItemsDao = new ListItemsDao();
        try {
            await validateCircleId(feedDto.circleId);
            await validateUserId(feedDto.circleId, feedDto.userId);
            await validateFeedId(feedDto);
            await validateListId(listDto);

            const listItem = await listItemsDao.createListItem(listItemDto, feedDto);
            res.status(201).json(listItem);
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'List'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
                res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: 'Internal Server Error' });
        } 
    });

    /**
     * @desc get listItems by listId
     * @route /api/v1/circles/:circle_id/users/:userId/feeds/:feedId/lists/:listId/listItems
     * @method GET
     * @access public
    */
    static getListItemsByListId = asyncHandler(async (req, res) => {
        const feedDto =  new FeedsDto({
            id: req.params.feedId,
            circleId: req.params.circleId,
            userId: req.params.userId
        });
        const listDto = new ListsDto({
            id: req.params.listId,
        });

        const listItemDto = new ListItemsDto(req.body);
        listItemDto.listId = req.params.listId;

        const listItemsDao = new ListItemsDao();
        try {
            await validateCircleId(feedDto.circleId);
            await validateUserId(feedDto.circleId, feedDto.userId);
            await validateFeedId(feedDto);
            await validateListId(listDto);

            const listItems = await listItemsDao.getListItemsByListId(listItemDto, feedDto);
            res.status(201).json(listItems);
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'List'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
                res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: 'Internal Server Error' });
        } 
    });

    /**
     * @desc update listItem
     * @route /api/v1/circles/:circle_id/users/:userId/feeds/:feedId/lists/:listId/listItems/listItemId
     * @method PUT
     * @access public
    */
    static updateListItemById = asyncHandler(async (req, res) => {
        const feedDto =  new FeedsDto({
            id: req.params.feedId,
            circleId: req.params.circleId,
            userId: req.params.userId
        });
        const listDto = new ListsDto({
            id: req.params.listId,
        });

        const listItemDto = new ListItemsDto(req.body);
        listItemDto.listId = req.params.listId;
        listItemDto.id = req.params.listItemId;

        const error = ListItemValidator.updateListItem(listItemDto);
        if (error && error.error && error.error.details && error.error.details[0]) {
            return res.status(400).json({ message: error.error.details[0].message });
        }

        const listItemsDao = new ListItemsDao();
        try {
            await validateCircleId(feedDto.circleId);
            await validateUserId(feedDto.circleId, feedDto.userId);
            await validateFeedId(feedDto);
            await validateListId(listDto);

            await listItemsDao.updateListItemById(listItemDto, feedDto);
            res.status(201).json({ message: "List Item is Updated"});
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'List'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
                res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: 'Internal Server Error' });
        } 
    });

    /**
     * @desc delete listItem
     * @route /api/v1/circles/:circle_id/users/:userId/feeds/:feedId/lists/:listId/listItems/listItemId
     * @method DELETE
     * @access public
    */
     static deleteListItemById = asyncHandler(async (req, res) => {
        const feedDto =  new FeedsDto({
            id: req.params.feedId,
            circleId: req.params.circleId,
            userId: req.params.userId
        });
        const listDto = new ListsDto({
            id: req.params.listId,
        });

        const listItemDto = new ListItemsDto(req.body);
        listItemDto.listId = req.params.listId;
        listItemDto.id = req.params.listItemId;

        const listItemsDao = new ListItemsDao();
        try {
            await validateCircleId(feedDto.circleId);
            await validateUserId(feedDto.circleId, feedDto.userId);
            await validateFeedId(feedDto);
            await validateListId(listDto);

            await listItemsDao.deleteListItemById(listItemDto, feedDto);
            res.status(201).json({ message: "List Item is Deleted"});
        } catch (err) {
            const prefixes = ['Circle', 'User', 'Feed', 'List'];
            if (prefixes.some(prefix => err.message.startsWith(prefix))) {
                res.status(409).json({ message: err.message });
            }

            res.status(500).json({ message: 'Internal Server Error' });
        } 
    });

}

module.exports = { ListItemsController };