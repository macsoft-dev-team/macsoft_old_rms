const mobileDevicesService = require("../services/mobileDevices");
const handleError = (res, error) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

const registerDevice = async (req, res) => {
  try {
     const { imei, friendlyName} = req.body;

     const result = await mobileDevicesService.registerDevice(req.user, {
      imei,
      friendlyName, 
    });

     res.status(201).json({
      success: true,
      message: "Device registered successfully",
      data: result,
    });
  } catch (error) {
     handleError(res, error);
  }
};
const getUserDevices = async (req, res) => {
  try {
    // PASS ENTIRE USER OBJECT
    const devices = await mobileDevicesService.getUserDevices(req.user);
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
    // PASS ENTIRE USER OBJECT
    const result = await mobileDevicesService.getDeviceDetails(req.user, req.params.deviceId);
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
    // PASS ENTIRE USER OBJECT
    const result = await mobileDevicesService.getDeviceStatistics(
      req.user,
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
    await mobileDevicesService.removeDeviceMapping(req.user, req.params.deviceId);
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
    const result = await mobileDevicesService.controlMotor(req.user, req.body);
    res.status(200).json({
      success: true,
      message: result.message,
      motor_status: result.motor_status,
    });
  } catch (error) {
    handleError(res, error);
  }
};

//customer 

const getAllCustomers = async (req, res) => {
  try {
    const customers = await mobileDevicesService.getAllCustomers(req.user);
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await mobileDevicesService.getCustomerById(req.user, req.params.customerId);
    res.status(200).json({
      success: true,
      data: customer,
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
  getAllCustomers,
  getCustomerById,
};