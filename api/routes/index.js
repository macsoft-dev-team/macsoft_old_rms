const express = require("express");
const router = express.Router();
const auth = require("./auth");
const devices = require("./devices");
const mappings = require("./mappings");
const customers = require("./customers");
const commands = require("./commands");
const templates = require("./templates");
const uploadDevices = require("./uploads/devices");
const uploadMappings = require("./uploads/mappings");
const dashboard = require("./dashboard");
const { verifyToken } = require("../middleware/auth");

router.use("/auth", auth);
router.use("/dashboard", verifyToken, dashboard);
router.use("/devices", devices);
router.use("/mappings", verifyToken, mappings);
router.use("/customers", verifyToken, customers);
router.use("/templates/modbus", verifyToken, templates);
router.use("/commands", verifyToken, commands);
router.use("/upload/devices", verifyToken, uploadDevices);
router.use("/upload/mappings", verifyToken, uploadMappings);
module.exports = router;

