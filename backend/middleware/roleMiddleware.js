// middleware/roleMiddleware.js
const { ErrorResponse } = require('./errorHandler');

// Middleware to check if user has required role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};

module.exports = { authorizeRoles };
