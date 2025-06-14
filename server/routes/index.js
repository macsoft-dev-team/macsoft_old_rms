const express = require('express');
const router = express.Router();
const auth = require('./auth');
const device=require('./devices');

router.use('/devices', device);
router.use('/auth', auth);

module.exports = router;
