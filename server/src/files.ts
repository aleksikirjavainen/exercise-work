import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = "supersecret";

// Middleware: auth
function authenticate(req: Request, res: Response, next: () => void): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET) as { email: string };
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

router.get("/files", authenticate, (req: Request, res: Response) => {
  const uploadsPath = path.join(__dirname, "../uploads");

  fs.readdir(uploadsPath, (err, fileNames) => {
    if (err) return res.status(500).json({ message: "Failed to read uploads" });

    const userEmail = (req as any).user.email;
    const userPrefix = userEmail.replace(/[@.]/g, "-");

    const userFiles = fileNames.filter(name => name.startsWith(userPrefix));

    const fileData = userFiles.map(filename => {
      const fullPath = path.join(uploadsPath, filename);
      const { size, mtime } = fs.statSync(fullPath);

      return {
        filename,
        size,
        lastModified: mtime,
        url: `/api/download/${filename}`,
      };
    });

    res.json(fileData);
  });
});

router.get("/download/:filename", authenticate, (req: Request, res: Response) => {
  const file = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", file);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: "File not found" });
    return
  }

  res.download(filePath);
});

router.delete("/files/:filename", authenticate, (req: Request, res: Response) => {
  const file = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", file);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: "File not found" });
    return
  }

  fs.unlinkSync(filePath);
  res.json({ message: "File deleted successfully" });
});



export default router;
