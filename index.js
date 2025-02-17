import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import serviceRoutes from "./routes/serviceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

import cors from "cors";
import uploadFiles from "./middlewares/uploadFiles.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/uploads", express.static("uploads"));

app.get("/", (_, res) => res.send("Welcome home route!"));
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/team", teamRoutes);

app.use("/uploads", express.static("uploads"));

app.post("/api/upload", (req, res) => uploadFiles(req, res));

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`http://localhost:${PORT}`)))
  .catch((error) => console.log("mongodb error: " + error));
