const deviceService = require("../services/devices");

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
  const { imeinumber } = req.params;
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
  const  data  = req.body;
  try {
    const result = await deviceService.uploadDevices(data);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error uploading devices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getDevices,
  getDeviceByImei,
  uploadDevices,
};
