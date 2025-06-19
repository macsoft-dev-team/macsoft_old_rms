const deviceController = require('../controllers/devices');
const express = require('express');
const router = express.Router();

router.get('/', deviceController.getDevices);
router.get("/device/:imeinumber", deviceController.getDeviceByImei);
router.get("/:deviceId", deviceController.getDeviceById);
router.post('/upload', deviceController.uploadDevices);
module.exports = router;