import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { authenticate, sanitizeFilename } from "./functions";

const router = express.Router();

// Authenticated route: List only the logged-in user's own files
router.get("/files", authenticate, (req: Request, res: Response) => {
  const uploadsPath = path.join(__dirname, "../uploads");

  fs.readdir(uploadsPath, (err, fileNames) => {
    if (err) return res.status(500).json({ message: "Failed to read uploads" });

    const userEmail = (req as any).user.email;
    const userPrefix = userEmail.replace(/[@.]/g, "-");

    // Securely list only files that start with user's own prefix
    const userFiles = fileNames.filter(name => name.startsWith(userPrefix + "-"));

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

// Secure download: validate filename to prevent path traversal attacks
router.get("/download/:filename", authenticate, (req: Request, res: Response) => {
  let file = req.params.filename;

  file = sanitizeFilename(file);

  const uploadsDir = path.resolve(__dirname, "../uploads");
  const filePath = path.join(uploadsDir, file);

  // Confirm the resolved path stays inside uploads directory
  if (!filePath.startsWith(uploadsDir)) {
    res.status(400).json({ message: "Invalid file path" });
    return
  }

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: "File not found" });
    return
  }

  res.download(filePath);
});

// Secure delete: validate filename and ownership before deleting
router.delete("/files/:filename", authenticate, (req: Request, res: Response) => {
  let file = req.params.filename;

  file = sanitizeFilename(file);

  const uploadsDir = path.resolve(__dirname, "../uploads");
  const filePath = path.join(uploadsDir, file);

  // Confirm the resolved path stays inside uploads directory
  if (!filePath.startsWith(uploadsDir)) {
    res.status(400).json({ message: "Invalid file path" });
    return
  }

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: "File not found" });
    return
  }

  fs.unlinkSync(filePath);
  res.json({ message: "File deleted successfully" });
});

export default router;
