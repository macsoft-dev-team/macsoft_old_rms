const mobileDevicesService = require("../services/mobileDevices");

const handleError = (res, error) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

const registerDevice = async (req, res) => {
  try {
    const result = await mobileDevicesService.registerDevice(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getUserDevices = async (req, res) => {
  try {
    const devices = await mobileDevicesService.getUserDevices(req.user.id);
    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getDeviceDetails = async (req, res) => {
  try {
    const result = await mobileDevicesService.getDeviceDetails(req.user.id, req.params.deviceId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getDeviceStatistics = async (req, res) => {
  try {
    const result = await mobileDevicesService.getDeviceStatistics(
      req.user.id,
      req.params.deviceId,
      req.query.days
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteDevice = async (req, res) => {
  try {
    await mobileDevicesService.removeDeviceMapping(req.user.id, req.params.deviceId);
    res.status(200).json({
      success: true,
      message: "Device removed from your account",
    });
  } catch (error) {
    handleError(res, error);
  }
};

const controlMotor = async (req, res) => {
  try {
    const result = await mobileDevicesService.controlMotor(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: result.message,
      motor_status: result.motor_status,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  registerDevice,
  getUserDevices,
  getDeviceDetails,
  getDeviceStatistics,
  deleteDevice,
  controlMotor,
};
