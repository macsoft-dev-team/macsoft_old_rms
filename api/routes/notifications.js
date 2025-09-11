const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notification')

 
router.get('/', notificationController.getAllNotifications);
router.put('/:id/read', notificationController.markNotificationAsRead);
module.exports = router;