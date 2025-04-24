import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./users";
import uploadRoutes from "./upload";
import fileRoutes from "./files"
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.disable("x-powered-by"); // Vulnerability found and fixed by SonarQube

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api", userRoutes);
app.use("/api", uploadRoutes);
app.use("/api", fileRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
