import express from "express";
import {
  getAllMembers,
  getOneMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/teamController.js";

const router = express.Router();

router.get("/", getAllMembers);
router.get("/:id", getOneMembers);
router.post("/create", createMember);
router.put("/update/:id", updateMember);
router.delete("/delete/:id", deleteMember);

export default router;
