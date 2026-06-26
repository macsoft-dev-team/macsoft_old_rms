const mobileAuthService = require("../services/mobileAuth");

const handleError = (res, error) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

const register = async (req, res) => {
  try {
    const result = await mobileAuthService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const login = async (req, res) => {
  try {
    console.log("[mobileAuth.controller.login] incoming request", {
      bodyKeys: Object.keys(req.body || {}),
      mobile: req.body?.mobile || null,
      hasPin: !!req.body?.pin,
    });

    const result = await mobileAuthService.login(req.body);

    console.log("[mobileAuth.controller.login] response success", {
      mobile: req.body?.mobile || null,
      userId: result?.user?.id || null,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[mobileAuth.controller.login] response error", {
      mobile: req.body?.mobile || null,
      message: error.message,
      status: error.status || 500,
      stack: error.stack,
    });
    handleError(res, error);
  }
};

const checkMobile = async (req, res) => {
  try {
    const result = await mobileAuthService.checkMobile(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await mobileAuthService.getProfile(req.user.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  register,
  login,
  checkMobile,
  getProfile,
};
