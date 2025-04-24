import express, { Request, Response } from "express";
import multer from "multer";
import jwt from "jsonwebtoken";

const router = express.Router();

const JWT_SECRET = "supersecret"; // replace with env var in production

// Multer disk storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save to server/uploads/
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
}); // ✅ continue

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});


function authenticate(req: Request, res: Response, next: () => void): void {
    const auth = req.headers.authorization;
  
    if (!auth?.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }
  
    const token = auth.split(" ")[1];
    try {
      const user = jwt.verify(token, JWT_SECRET) as { email: string };
      (req as any).user = user;
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  }

// POST /api/upload
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
