import express, { Request, Response } from "express";
import multer from "multer";
import jwt from "jsonwebtoken";

const router = express.Router();

const JWT_SECRET = "supersecret";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const userEmail = (req as any).user.email;
    const prefix = userEmail.replace(/[@.]/g, "-");
    const unique = Date.now() + "-" + file.originalname;
    cb(null, `${prefix}-${unique}`);
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});


function authenticate(req: Request, res: Response, next: () => void): void {
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
