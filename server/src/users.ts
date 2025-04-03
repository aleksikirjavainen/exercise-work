import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const users: { email: string; passwordHash: string }[] = [];

const JWT_SECRET = "supersecret";

// Register route
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

// Login route
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  return res.json({ token });
});

router.get("/me", async (req: Request, res: Response): Promise<any> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "supersecret") as { email: string };
    return res.json({ email: decoded.email });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});


export default router;
