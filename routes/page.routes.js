const router = require('express').Router();
const { verifyToken } = require('../middlewares/verifyToken');

router
    .route('/')
    .get((req, res) => {
        res.render('index');
    });

router
    .route('/about-us')
    .get((req, res) => {
        res.render('about-us');
    });

router
    .route('/signup/:circleId?/:token?')
    .get((req, res) => {
        res.render('signup');
    });

router
    .route('/login')
    .get((req, res) => {
        res.render('login');
    });

router
    .route('/create-circle')
    .get((req, res) => {
        res.render('create-circle');
    });

router
    .route('/forget-password')
    .get((req, res) => {
        res.render('forget-password');
    });

router.
    route('/reset-password')
    .get((req, res) => {
        res.render('reset-password');
    });

router
    .route('/home')
    .get(verifyToken, (req, res) => {
        res.render('home');
    });

router
    .route('/calendar')
    .get(verifyToken, (req, res) => {
        res.render('calendar');
    });

router
    .route('/lists')
    .get(verifyToken, (req, res) => {
        res.render('lists');
    });

router
    .route('/gallery')
    .get(verifyToken, (req, res) => {
        res.render('gallery');
    });

router
    .route('/contacts-book')
    .get(verifyToken, (req, res) => {
        res.render('contacts-book');
    });

router
    .route('/settings')
    .get(verifyToken, (req, res) => {
        res.render('settings');
    });

module.exports = { router };
