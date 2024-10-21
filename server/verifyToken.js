import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token; // Safely check if cookies exist

  // Check if the token is available
  if (!token) {
    return res.status(403).json({ message: "Unauthorized: No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid or expired token" });
    }

    // Attach the user data from the token to req.user
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  });
};
