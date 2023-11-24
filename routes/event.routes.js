const router = require('express').Router();

const { EventsController } = require('../controller/event.controller')


router.route('/:circleId/users/:userId/events/')
    .post(EventsController.createEvent);

router.route('/:circleId/events/')
    .get(EventsController.getEventsByCircleId)

router.route('/:circleId/events/:eventId')
.get(EventsController.getEventById)

router.route('/:circleId/feeds/:feedId/events/:eventId')
    .put(EventsController.updateEventById)


module.exports = { router }