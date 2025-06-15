const deviceController = require('../controllers/devices');
const express = require('express');
const router = express.Router();

router.get('/', deviceController.getDevices);
router.get('/:imeinumber', deviceController.getDeviceByImei);
router.post('/upload', deviceController.uploadDevices);
module.exports = router;