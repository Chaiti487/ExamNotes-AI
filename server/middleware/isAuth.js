import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // Check whether authentication token exists
    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please log in.",
      });
    }

    // Check server configuration
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        message: "Internal server error",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate decoded user information
    if (!decoded?.userId) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    // Attach authenticated user ID to request
    req.userId = decoded.userId;

    return next();
  } catch (error) {
    // Handle expired token
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
      });
    }

    // Handle invalid or inactive token
    if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    // Handle unexpected server errors
    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default isAuth;
