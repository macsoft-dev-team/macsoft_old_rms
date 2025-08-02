const deviceService = require("../services/devices");

const getAllDevices = async (req, res) => {
  try {
    const { skip, take, filter } = req.query;
    // destructure user from cookies
    const user = req.user; // Assuming user is set by authentication middleware
    const { devices, count } = await deviceService.getAllDevices(
      skip,
      take,
      filter,
      user
    );

    res.status(200).json({
      devices,
      totalPages: Math.ceil(count / take),
      currentPage: parseInt(skip) || 1,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDeviceById = async (req, res) => {
  try {
     const { id } = req.params;
    const device = await deviceService.getDeviceById(id);
    if (!device) return res.status(404).json({ error: "Device not found" });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createDevice = async (req, res) => {
  try {
    const device = await deviceService.createDevice(req.body);
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDevice = async (req, res) => {
  try {
    const device = await deviceService.updateDevice(req.params.id, req.body);
    if (!device) return res.status(404).json({ error: "Device not found" });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDevice = async (req, res) => {
  try {
    const result = await deviceService.deleteDevice(req.params.id);
    if (!result) return res.status(404).json({ error: "Device not found" });
    res.json({ message: "Device deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
};
