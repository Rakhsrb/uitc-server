import express from "express";
import {
  getAllServices,
  getOneService,
  createNewService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getOneService);
router.post("/create", createNewService);
router.put("/update/:id", updateService);
router.delete("/delete/:id", deleteService);

export default router;
