const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/users");

//login by email and password
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: "User is not active" });
    }
    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    delete user.password; // Remove password from user object
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    // Set httpOnly cookie with the token
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      path: "/",
    });
    // Store user in a separate cookie (not httpOnly, so frontend can read if needed)
    res.cookie("user", JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      message: "Login successful",
      user,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//verifyToken
const verifyToken = async (req, res, next) => {
  // Try to get token from cookie first, then fallback to Authorization header
  const token =
    req.cookies?.auth_token ||
    (req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1]);

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const user = await userService.getUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      delete user.password;
      req.user = user;
      next();
    } catch (dbErr) {
      return res.status(500).json({ message: "Error fetching user", error: dbErr.message });
    }
  });
};

// Logout function
const logout = (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.clearCookie("user", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.json({ message: "Logout successful", success: true });
};

// Check authentication status
const checkAuth = async (req, res) => {
  try {
    const token = req.cookies?.auth_token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authenticated", isAuthenticated: false });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Token invalid", isAuthenticated: false });
      }

      // Get user data
      const user = await userService.getUserById(decoded.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not found", isAuthenticated: false });
      }

      delete user.password; // Remove password from response
      res.json({
        isAuthenticated: true,
        user,
        message: "Authenticated",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  logout,
  checkAuth,
  verifyToken,
};
