const express = require('express');
const router = express.Router();
const auth = require('./auth');
const device=require('./devices');
const deviceLog = require('./deviceLog');
const template = require('./template');
const user = require('./user');
const customer = require('./customers');

router.use('/devices', device);
router.use('/device-logs', deviceLog);
router.use('/templates', template);
// Auth routes
router.use('/auth', auth);
router.use('/users', user);
router.use('/customers', customer);

module.exports = router;
