const jwt = require("jsonwebtoken");
const constants = require("../utils/constants");
const userController = require("../controllers/users");

module.exports = {
  check_authentication: async function (req, res, next) {
    try {
      // Check if the Authorization header exists
      if (req.headers && req.headers.authorization) {
        const authorization = req.headers.authorization;

        // Check if the token starts with "Bearer "
        if (authorization.startsWith("Bearer ")) {
          const token = authorization.split(" ")[1]; // Extract the token

          // Verify the token
          const decoded = jwt.verify(token, constants.SECRET_KEY);

          // Check if the token is expired
          if (decoded.exp * 1000 > Date.now()) {
            req.accessToken = token; // Attach the token to the request
            req.user = decoded; // Attach the decoded user data to the request
            next(); // Proceed to the next middleware or route
          } else {
            // Token expired
            const error = new Error("Token expired");
            error.statusCode = 403;
            throw error;
          }
        } else {
          // Invalid token format
          const error = new Error("Invalid token format");
          error.statusCode = 403;
          throw error;
        }
      } else {
        // No Authorization header
        const error = new Error("Authorization header missing");
        error.statusCode = 403;
        throw error;
      }
    } catch (error) {
      // Handle JWT-specific errors
      if (error.name === "JsonWebTokenError") {
        error.message = "Invalid token";
        error.statusCode = 403;
      } else if (error.name === "TokenExpiredError") {
        error.message = "Token expired";
        error.statusCode = 403;
      }
      next(error); // Pass the error to the global error handler
    }
  },

  check_authorization: function (roles) {
    return async function (req, res, next) {
      try {
        const roleOfUser = req.user.role; // Assuming `req.user` contains the role
        if (roles.includes(roleOfUser)) {
          next(); // User is authorized
        } else {
          const error = new Error("You do not have the required permissions");
          error.statusCode = 403;
          throw error;
        }
      } catch (error) {
        next(error); // Pass the error to the global error handler
      }
    };
  },
};
