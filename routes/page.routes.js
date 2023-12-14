const router = require('express').Router();

router.get('/', (req, res) => {

    res.render('index');
});

router.get('/about-us', (req, res) => {
    res.render('about-us');
});

router.get('/signup/:circleId?/:token?', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/create-circle', (req, res) => {
    res.render('create-circle');
});

router.get('/forget-password', (req, res) => {
    res.render('forget-password');
});

router.get('/reset-password', (req, res) => {
    res.render('reset-password');
});

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/calendar', (req, res) => {
    res.render('calendar');
});

router.get('/lists', (req, res) => {
    res.render('lists');
});

router.get('/gallery', (req, res) => {
    res.render('gallery');
});

router.get('/contacts-book', (req, res) => {
    res.render('contacts-book');
});

router.get('/settings', (req, res) => {
    res.render('settings');
});

module.exports = { router };
