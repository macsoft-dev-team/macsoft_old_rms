const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commands');

router.get("/:deviceId", commandController.getAllCommandsByDeviceId);
router.post('/', commandController.createCommand);

module.exports = router;