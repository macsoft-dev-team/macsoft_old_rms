
const express = require('express');
const router = express.Router();
const devicesController = require('../controllers/devices');
const deviceLogController = require('../controllers/devicelog');
const { verifyToken } = require("../middleware/auth");

// Protect all device routes with verifyToken
router.get('/mqtt-credentials', devicesController.getDeviceByImei);
router.get('/dev/:imeinumber', devicesController.getDeviceByImeiNumber);
router.get('/', verifyToken, devicesController.getAllDevices);
router.get('/:id', verifyToken, devicesController.getDeviceById);
router.post('/', verifyToken, devicesController.createDevice);
router.put('/:id', verifyToken, devicesController.updateDevice);
router.delete('/:id', verifyToken, devicesController.deleteDevice);
router.get('/logs/:imeinumber/export', verifyToken, deviceLogController.exportDeviceLogs);
router.get('/logs/:imeinumber', verifyToken, deviceLogController.getDeviceLogs);

module.exports = router;
