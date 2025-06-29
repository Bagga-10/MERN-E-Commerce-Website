import jwt from "jsonwebtoken";
import User from "../models/userModal.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  console.log("--- AUTHENTICATE MIDDLEWARE --- ");
  console.log("Checking for JWT_SECRET:", !!process.env.JWT_SECRET ? "Found" : "MISSING!");

  let token = req.cookies.jwt;
  console.log("Token from cookies:", token ? "Exists" : "Not found");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      console.log("Token verified successfully for user:", req.user.username);
      next();
    } catch (error) {
      console.error("AUTHENTICATION ERROR:", error.message);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    console.error("No token found in cookies.");
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const authorizeAdmin = (req, res, next) => {
  console.log("--- AUTHORIZE ADMIN MIDDLEWARE ---");
  if (req.user && req.user.isAdmin) {
    console.log("User is admin, proceeding.");
    next();
  } else {
    console.error("Authorization failed: User is not an admin.");
    res.status(401).send("Not authorized as an admin");
  }
};

export { authenticate, authorizeAdmin };





