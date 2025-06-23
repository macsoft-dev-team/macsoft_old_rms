const deviceService = require("../services/devices");
const bcrypt = require('bcrypt');

const getDevices = async (req, res) => {
  const { skip, take, filter } = req.query;
  try {
    const { devices, count } = await deviceService.getDevices(
      skip,
      take,
      filter
    );
    res
      .status(200)
      .json({
        devices,
        currentPage: parseInt(skip) || 1,
        totalPages: Math.ceil(count / (take ? parseInt(take) : 10)),
      });
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDeviceByImei = async (req, res) => {
  // Extract imeinumber from query parameters
  const { imeinumber } = req.query;
  try {
    const device = await deviceService.getDeviceByImei(imeinumber);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.status(200).json(device);
  } catch (error) {
    console.error("Error fetching device by IMEI:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadDevices = async (req, res) => {
  let data = req.body;
  try {
    data = data.map((device) => ({
      imeinumber: device.imeinumber,
      host: process.env.MQTT_HOST,
      port: parseInt(process.env.MQTT_PORT),
      username: `device_${device.imeinumber}`,
      password: bcrypt.hashSync(device.imeinumber, 10), // Hash the password
      pubTopicData: `device/${device.imeinumber}/data`,
      subTopicCmd: `device/${device.imeinumber}/cmd`,
      pubTopicCmd: `device/${device.imeinumber}/cmd/response`,
    }));
    const result = await deviceService.uploadDevices(data);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error uploading devices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDeviceById = async (req, res) => {
  const { deviceId } = req.params;
  try {
    const device = await deviceService.getDeviceById(deviceId);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.status(200).json(device);
  } catch (error) {
    console.error("Error fetching device by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getDevices,
  getDeviceByImei,
  uploadDevices,
  getDeviceById,
};
