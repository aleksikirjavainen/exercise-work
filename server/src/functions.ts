import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// Middleware: Authenticate requests using JWT token stored in HttpOnly cookies
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
    (req as any).user = decoded; // Attach verified user to request object
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Helper function: Sanitize filenames to prevent path traversal and injection attacks
export function sanitizeFilename(filename: string): string {
  // Extract base filename (remove any directory paths)
  let baseName = filename.split("/").pop()?.split("\\").pop() || "";

  // Replace all unsafe characters with a dash
  baseName = baseName.replace(/[^a-zA-Z0-9._-]/g, "-");

  // Limit maximum filename length to 255 characters
  if (baseName.length > 255) {
    baseName = baseName.substring(0, 255);
  }

  return baseName;
}
