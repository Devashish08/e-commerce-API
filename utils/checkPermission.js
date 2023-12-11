/** @format */

const CustomError = require("../errors");

const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") {
    return;
  }
  if (requestUser.userId === resourceUserId.toString()) {
    return;
  }
  throw new CustomError.UnauthorizeError(
    "you are not authorized to access this route"
  );
};

module.exports = checkPermission;
