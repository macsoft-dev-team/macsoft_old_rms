const express = require("express");
const mobileDevicesController = require("../controllers/mobileDevices");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

router.post("/register", mobileDevicesController.registerDevice);
router.get("/", mobileDevicesController.getUserDevices);
router.get("/:deviceId/statistics", mobileDevicesController.getDeviceStatistics);
router.get("/:deviceId", mobileDevicesController.getDeviceDetails);
router.post("/motor-control", mobileDevicesController.controlMotor);
router.delete("/:deviceId", mobileDevicesController.deleteDevice);
router.get("/customers", mobileDevicesController.getAllCustomers);
router.get("/customers/:customerId", mobileDevicesController.getCustomerById);

module.exports = router;
