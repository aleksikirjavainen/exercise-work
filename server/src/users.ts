import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

const router = Router();
const users: { email: string; passwordHash: string }[] = [];

const JWT_SECRET = process.env.JWT_SECRET!;

// Registration route: validates inputs and securely hashes passwords
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Must be a valid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Prevent duplicate account registration
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Securely hash password before storing
    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ email, passwordHash });

    return res.status(201).json({ message: "User registered successfully" });
  }
);

// Login route: validates credentials and issues signed JWT
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Must be a valid email address"),
    body("password")
      .notEmpty()
      .withMessage("Password cannot be empty"),
  ],
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set HttpOnly cookie to securely store JWT
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Only over HTTPS in production
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.json({ message: "Login successful" });
  }
);

// Logout route: clears authentication cookie
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.json({ message: "Logged out successfully" });
});

// Authenticated route: verifies JWT and returns user data
router.get("/me", (req: Request, res: Response): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    res.json({ email: decoded.email });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
