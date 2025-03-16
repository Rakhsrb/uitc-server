import express from "express";
import {
  createCarousel,
  getCarousels,
  deleteCarousel,
} from "../controllers/carouselController.js";

const router = express.Router();

router.post("/", createCarousel);
router.get("/", getCarousels);
router.delete("/:id", deleteCarousel);

export default router;
