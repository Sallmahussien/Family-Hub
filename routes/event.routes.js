const router = require('express').Router();

const { EventsController } = require('../controllers/event.controller')


router
    .route('/:circleId/users/:userId/events/')
    .post(EventsController.createEvent);

router
    .route('/:circleId/events/')
    .get(EventsController.getEventsByCircleId);

router
    .route('/:circleId/users/:userId/feeds/:feedId/events/:eventId')
    .get(EventsController.getEventById)
    .put(EventsController.updateEventById);

module.exports = { router };
