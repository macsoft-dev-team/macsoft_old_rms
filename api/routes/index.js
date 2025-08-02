const express = require('express');
const router = express.Router();
const auth =require('./auth')
const devices = require('./devices');
const customers = require('./customers');
 const { verifyToken } = require('../middleware/auth');

router.use('/auth', auth);
router.use('/devices', verifyToken, devices);
router.use('/customers', verifyToken, customers);

module.exports = router;
