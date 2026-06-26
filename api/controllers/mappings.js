const mappingService = require("../services/mappings");

const getAllDevices = async (req, res) => {
  try {
    const { skip, take, filter } = req.query;
    const user = req.user;
    const { devices, count } = await mappingService.getAllDevices(
      skip,
      take,
      filter,
      user
    );
    res.status(200).json({
      mappings: devices,
      totalPages: Math.ceil(count / take),
      currentPage: parseInt(skip) || 1,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDeviceById = async (req, res) => {
  try {
    const { imeinumber } = req.params;
    const device = await mappingService.getDeviceById(imeinumber);
    if (!device) return res.status(404).json({ error: "Device not found" });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDevice = async (req, res) => {
  try {
    const device = await mappingService.updateDevice(
      req.params.imeinumber,
      req.body
    );
    if (!device) return res.status(404).json({ error: "Device not found" });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createDeviceMapping = async (req, res) => {
  try {
    const { imeinumber } = req.body;
    if (!imeinumber) {
      return res.status(400).json({ error: "IMEI number is required" });
    }
    const device = await mappingService.createDeviceMapping(req.body);
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const publishSnaDetails = async (req, res) => {
  try {
    const { imeinumber } = req.params;
    const result = await mappingService.publishSnaDetails(imeinumber);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllDevices,
  getDeviceById,
  updateDevice,
  createDeviceMapping,
  publishSnaDetails,
};
