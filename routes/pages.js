const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/push', (req, res) => {
    res.render('push');
})

router.get('/test', (req, res) => {
    res.render('test');
})


module.exports = router;