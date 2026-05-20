const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate Access Token (expires in 15 minutes)
exports.generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
 

// Generate Refresh Token (expires in 2 hours)
exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "2d",
  });
};


exports.generateUserToken = (payload, exp) => {
  return jwt.sign(payload, process.env.USER_TOKEN_SECRET, { expiresIn: exp });
};