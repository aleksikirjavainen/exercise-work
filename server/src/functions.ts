import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function authenticate(
  req: Request,
  res: Response,
  next: () => void
): void {
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

export function sanitizeFilename(filename: string): string {
  // Remove directory paths
  let baseName = filename.split("/").pop()?.split("\\").pop() || "";

  // Only allow letters, numbers, dashes, underscores, and dots
  baseName = baseName.replace(/[^a-zA-Z0-9._-]/g, "-");

  // Limit filename length to 255 chars
  if (baseName.length > 255) {
    baseName = baseName.substring(0, 255);
  }

  return baseName;
}
