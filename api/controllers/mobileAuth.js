const mobileAuthService = require("../services/mobileAuth");

const handleError = (req, res, error, requestId) => {
  const status = error.status || 500;

  console.error("[mobileAuth.controller] request failed", {
    requestId,
    method: req.method,
    path: req.originalUrl,
    mobile: req.body?.mobile || null,
    status,
    message: error.message,
    name: error.name,
    stack: error.stack,
  });

  const payload = {
    success: false,
    message: error.message || "Internal server error",
    request_id: requestId,
  };

  if (status >= 500) {
    payload.error_type = error.name || "Error";
  }

  res.status(status).json(payload);
};

const register = async (req, res) => {
  const requestId = `mobregister-${Date.now()}`;
  try {
    const result = await mobileAuthService.register(req.body);
    res.status(201).json({
      success: true,
      request_id: requestId,
      data: result,
    });
  } catch (error) {
    handleError(req, res, error, requestId);
  }
};

const login = async (req, res) => {
  const requestId = `moblogin-${Date.now()}`;
  try {
/*     console.log("[mobileAuth.controller.login] incoming request", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      bodyKeys: Object.keys(req.body || {}),
      mobile: req.body?.mobile || null,
      hasPin: !!req.body?.pin,
      forwardedFor: req.headers["x-forwarded-for"] || null,
      userAgent: req.headers["user-agent"] || null,
    }); */

    const result = await mobileAuthService.login(req.body);

/*     console.log("[mobileAuth.controller.login] response success", {
      requestId,
      mobile: req.body?.mobile || null,
      userId: result?.user?.id || null, 
    }); */

    res.status(200).json({
      success: true,
      request_id: requestId,
      data: result,
    });
  } catch (error) {
    handleError(req, res, error, requestId);
  }
};

const checkMobile = async (req, res) => {
  const requestId = `mobcheck-${Date.now()}`;
  try {
    const result = await mobileAuthService.checkMobile(req.body);
    res.status(200).json({
      success: true,
      request_id: requestId,
      data: result,
    });
  } catch (error) {
    handleError(req, res, error, requestId);
  }
};

const getProfile = async (req, res) => {
  const requestId = `mobme-${Date.now()}`;
  try {
    const result = await mobileAuthService.getProfile(req.user.id);
    res.status(200).json({
      success: true,
      request_id: requestId,
      data: result,
    });
  } catch (error) {
    handleError(req, res, error, requestId);
  }
};

const adminLogin = async (req, res) => {
  const requestId = `adminlogin-${Date.now()}`;
  try {
    // Pass email and password from req.body
    const result = await mobileAuthService.adminLogin(req.body);

    res.status(200).json({
      success: true,
      request_id: requestId,
      data: result,
    });
  } catch (error) {
    handleError(req, res, error, requestId);
  }
};


module.exports = {
  register,
  login,
  checkMobile,
  getProfile,
  adminLogin,
};
