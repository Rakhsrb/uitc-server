import express from "express";
import {
  createNewCourse,
  deleteCourse,
  getAllCourses,
  getOneCourse,
  updateCourse,
} from "../controllers/courseControlles.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getOneCourse);
router.post("/create", createNewCourse);
router.put("/update/:id", updateCourse);
router.delete("/delete/:id", deleteCourse);

export default router;
