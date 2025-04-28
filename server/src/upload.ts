import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { authenticate, sanitizeFilename } from "./functions";

const router = express.Router();

// Configure multer storage: secure filenames and destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const userEmail = (req as any).user.email;
    const prefix = userEmail.replace(/[@.]/g, "-");

    // Sanitize original filename and prefix with user email
    const safeFilename = sanitizeFilename(file.originalname);
    const unique = Date.now() + "-" + safeFilename;

    cb(null, `${prefix}-${unique}`);
  },
});

// Multer upload with file size and type restrictions
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase();

    // Validate file extension against allowed types
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error("Only image, pdf, and text files are allowed"));
    }

    cb(null, true);
  },
});

// Secure file upload route: requires authentication and validation
router.post("/upload", authenticate, upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  res.status(200).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: req.file.path,
  });
});

export default router;
