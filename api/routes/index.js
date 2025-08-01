const express = require('express');
const router = express.Router();
const auth =require('./auth')
const devices = require('./devices');

/* GET home page. */
router.use('/auth', auth);
router.use('/devices', devices);
module.exports = router;
