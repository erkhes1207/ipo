const express = require('express');
const authController = require('../controllers/auth');
const { route } = require('./pages');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/push', authController.push);
// router.get('/test', authController.test);


module.exports = router;