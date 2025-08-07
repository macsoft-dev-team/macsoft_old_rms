const express = require("express");
const router = express.Router();
const auth = require("./auth");
const devices = require("./devices");
const customers = require("./customers");
const commands = require("./commands");
const templates = require("./templates");
const uploadDevices = require("./uploads/devices");
const { verifyToken } = require("../middleware/auth");

router.use("/auth", auth);
router.use("/devices", devices);
router.use("/customers", verifyToken, customers);
router.use("/templates/modbus", verifyToken, templates);
router.use("/commands", verifyToken, commands);
router.use("/upload/devices", verifyToken, uploadDevices);

module.exports = router;
