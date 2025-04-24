import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function authenticate(req: Request, res: Response, next: () => void): void {
    const token = req.cookies?.token;
  
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
      (req as any).user = decoded;
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
}