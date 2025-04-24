import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const users: { email: string; passwordHash: string }[] = [];

const JWT_SECRET = "supersecret";

router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, passwordHash });

  return res.status(201).json({ message: "User registered successfully" });
});

router.post("/login", async (req: Request, res: Response): Promise<any> => {
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

  // Set token as HttpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // HTTPS only in production
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  res.json({ message: "Login successful" });
});

// GET or POST /api/logout
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // must match your login cookie settings
    sameSite: "strict",
  });

  res.json({ message: "Logged out successfully" });
});

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
