import express from "express";
import {
  createNewProject,
  deleteProject,
  getAllProjects,
  getOneProject,
  updateProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getOneProject);
router.post("/create", createNewProject);
router.put("/update/:id", updateProject);
router.delete("/delete/:id", deleteProject);

export default router;
