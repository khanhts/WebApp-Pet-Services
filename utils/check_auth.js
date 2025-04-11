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
          const result = jwt.verify(token, constants.SECRET_KEY);

          // Check if the token is expired
          if (result.expire > Date.now()) {
            let user = await userController.GetUserByID(result.id);
            req.accessToken = token;
            req.user = user;
            next();
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
      next(error); // Pass the error to the global error handler
    }
  },

  check_authorization: function (roles) {
    return async function (req, res, next) {
      try {
        console.log("User role:", req.user.role.name);
        let roleOfUser = req.user.role.name;
        if (roles.includes(roleOfUser)) {
          next();
        } else {
          throw new Error("ban khong co quyen");
        }
      } catch (error) {
        next(error);
      }
    };
  },
};
