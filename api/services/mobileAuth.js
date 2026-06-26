const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient, role } = require("@prisma/client");

const prisma = new PrismaClient();

const buildMobileUser = (user) => ({
  id: user.id,
  name: user.name || "",
  mobile: user.mobile,
  district: user.district,
  state: user.state,
  pin: user.pin,
  customerId: user?.customerId || null,

});

const signToken = (user) =>
  jwt.sign({ id: user.id, mobile: user.mobile, customerId: user?.customerId || null }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });

const normalizeMobile = (mobile = "") => mobile.trim();

const register = async ({ name, mobile, district, state, pin }) => {
  const normalizedMobile = normalizeMobile(mobile);

  if (!name || !normalizedMobile || !pin) {
    const error = new Error("Name, mobile and PIN are required");
    error.status = 400;
    throw error;
  }

  if (!/^\d{10}$/.test(normalizedMobile)) {
    const error = new Error("Mobile number must be 10 digits");
    error.status = 400;
    throw error;
  }

  if (!/^\d{6}$/.test(pin)) {
    const error = new Error("PIN must be 6 digits");
    error.status = 400;
    throw error;
  }

  const existingUser = await prisma.user.findFirst({
    where: { mobile: normalizedMobile },
  });

  if (existingUser) {
    const error = new Error("Mobile number already registered");
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(pin, 10);
  const syntheticEmail = `${normalizedMobile}@mobile.macsoft.local`;

  const user = await prisma.user.create({
    data: {
      email: syntheticEmail,
      name,
      password: passwordHash,
      mobile: normalizedMobile,
      district,
      state,
      pin,
      role: role.END_USER,
      isActive: true,
    },
  });

  return {
    token: signToken(user),
    user: buildMobileUser(user),
  };
};

const login = async ({ mobile, pin }) => {
  const normalizedMobile = normalizeMobile(mobile);

  console.log("[mobileAuth.login] request received", {
    mobile: normalizedMobile,
    hasPin: !!pin,
  });

  const user = await prisma.user.findFirst({
    where: { mobile: normalizedMobile, isActive: true },
  });

  console.log("[mobileAuth.login] user lookup result", {
    mobile: normalizedMobile,
    found: !!user,
    userId: user?.id || null,
    customerId : user?.customerId || null,
    isActive: user?.isActive ?? null,
  });

  if (!user || user.pin !== pin) {
    console.log("[mobileAuth.login] invalid credentials", {
      mobile: normalizedMobile,
      found: !!user,
      pinMatched: user ? user.pin === pin : false,
    });
    const error = new Error("Invalid mobile number or PIN");
    error.status = 401;
    throw error;
  }

  console.log("[mobileAuth.login] login successful", {
    mobile: normalizedMobile,
    userId: user.id,
  });

  return {
    token: signToken(user),
    user: buildMobileUser(user),
  };
};

const checkMobile = async ({ mobile }) => {
  const normalizedMobile = normalizeMobile(mobile);
  const user = await prisma.user.findFirst({
    where: { mobile: normalizedMobile },
    select: { id: true },
  });

  return {
    isRegistered: !!user,
    requiresRegistration: !user,
  };
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return buildMobileUser(user);
};

const adminLogin = async ({ email, password }) => {
  console.log("[mobileAuth.adminLogin] request received", {
    email: email,
    hasPassword: !!password,
  });

  // 1. Find user by email
  const user = await prisma.user.findFirst({
    where: {
      email: email,
      isActive: true
    },
  });

  console.log("[mobileAuth.adminLogin] user lookup result", {
    email: email,
    found: !!user,
    role: user?.role || null,
  });

  // 2. Handle User Not Found
  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  // 3. Role Protection: Block standard users from using this login
  // Adjust these roles based on your exact schema
  const allowedRoles = ["MACSOFT_ADMIN", "MACSOFT_USER", "CUSTOMER_ADMIN", "CUSTOMER_USER"];
  if (!allowedRoles.includes(user.role)) {
    console.log("[mobileAuth.adminLogin] unauthorized role attempt", { email, role: user.role });
    const error = new Error("Unauthorized access. Administrators only.");
    error.status = 403;
    throw error;
  }

  // 4. Verify Password (Assuming passwords are hashed in your DB)
  // If you are storing passwords in plain text (not recommended), use: user.password !== password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    console.log("[mobileAuth.adminLogin] invalid password", { email });
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  console.log("[mobileAuth.adminLogin] login successful", {
    email: email,
    userId: user.id,
    role: user.role,
  });

  // 5. Return payload (Ensure your signToken includes the role & customerId!)
  return {
    token: signToken(user),
    user: buildMobileUser(user),
  };
};

module.exports = {
  register,
  login,
  checkMobile,
  getProfile,
  adminLogin,
};
