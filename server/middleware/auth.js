const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try {
    // Check if authorization header exists
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({
        error: "Authentication required",
        message: "Please log in to perform this action."
      });
    }

    // Get the token from the authorization header
    const token = authHeader.split(" ")[1];
    if (!token) {
      return response.status(401).json({
        error: "Authentication required",
        message: "Invalid authorization format. Please log in again."
      });
    }

    // Check if the token matches the supposed origin
    const decodedToken = jwt.verify(token, "RANDOM-TOKEN");

    // Retrieve the user details of the logged in user
    const user = decodedToken;

    // Pass the user down to the endpoints here
    request.user = user;

    // Pass down functionality to the endpoint
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
        error: "Session expired",
        message: "Your session has expired. Please log in again."
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({
        error: "Invalid token",
        message: "Invalid authentication. Please log in again."
      });
    }
    response.status(401).json({
      error: "Authentication failed",
      message: "Please log in to continue."
    });
  }
};