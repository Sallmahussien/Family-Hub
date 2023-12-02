const router = require('express').Router();

const { EventsController } = require('../controllers/event.controller');

const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAuthorizationForCreator
    } = require('../middlewares/verifyToken');


router
    .route('/:circleId/users/:userId/events/')
    .post(verifyTokenAndAuthorizationForCreator, EventsController.createEvent);

router
    .route('/:circleId/events/')
    .get(verifyToken, EventsController.getEventsByCircleId);

router
    .route('/:circleId/users/:userId/feeds/:feedId/events/:eventId')
    .get(verifyToken, EventsController.getEventById)
    .put(verifyTokenAndAuthorization, EventsController.updateEventById);

module.exports = { router };
