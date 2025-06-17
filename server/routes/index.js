const express = require('express');
const router = express.Router();
const auth = require('./auth');
const device=require('./devices');
const deviceLog = require('./deviceLog');

router.use('/devices', device);
router.use('/device-logs', deviceLog);
router.use('/auth', auth);

module.exports = router;
