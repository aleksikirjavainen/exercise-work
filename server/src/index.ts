import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./users";
import uploadRoutes from "./upload";
import fileRoutes from "./files"

const app = express();

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
