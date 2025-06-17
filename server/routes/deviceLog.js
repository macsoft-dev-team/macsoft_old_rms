const express = require('express');
const router = express.Router();
const deviceLogController = require('../controllers/deviceLog');

router.get('/', deviceLogController.getDeviceLogs);

module.exports = router;