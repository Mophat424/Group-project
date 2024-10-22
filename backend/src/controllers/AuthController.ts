import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getXataClient } from "../xata"; // Import the Xata client
import { validationResult } from "express-validator";

const xata = getXataClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register a new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await xata.db.User.filter({ email }).getFirst();
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await xata.db.User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
};

// Login a user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await xata.db.User.filter({ email }).getFirst();

    // If user is null or password is missing, send an error response
    if (!user || !user.password) {
      res.status(400).json({ message: "Invalid credentials" });
    } else {
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
      } else {
        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
          expiresIn: "1h",
        });
        res.json({ token });
      }
    }
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
};

// Middleware to protect routes
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
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        role: string;
      };
      (req as any).user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Token is not valid" });
    }
  }
};

// Middleware to restrict access to admin users
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;
  if (!user || user.role !== "Admin") {
    res.status(403).json({ message: "Admin access only" });
  }
  next();
};