import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

interface UserPayload {
  id: string;
  role: string;
}

// Extend the Express Request interface globally
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; 
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
  } else {
    try {
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
      req.user = decoded; 
      next(); 
    } catch (err) {
      console.error("Token verification error:", err);
      res.status(401).json({ message: "Token is not valid" });
    }
  }
};