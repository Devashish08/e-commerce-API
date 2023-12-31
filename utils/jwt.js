/** @format */

const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME
  });
  return token;
};
const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookieToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  // Set cookie expiration time
  const oneDay = 1000 * 60 * 60 * 24;

  // Set JWT token as a cookie in the response
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookieToResponse
};
