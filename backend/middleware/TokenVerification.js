import jwt from "jsonwebtoken";
import User from "../models/User.js";

const TokenVerification = async (req, res, next) => {
  try {
    // Retrieve the token from headers or cookies
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const tokenFromCookie = req.cookies.Token;

    // Prefer the token from headers if available
    const token = tokenFromHeader || tokenFromCookie;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY,async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token is not valid" });
      }

      const user = await User.findById(decoded.id)
      // Attach user information to the request object
      req.user = user
      
      // Proceed to the next middleware or route handler
      next();
    });
  } catch (err) {
    console.error("Token Verification Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default TokenVerification;
