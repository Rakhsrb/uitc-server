import Carousel from "../models/carousel.js";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${hash}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export const createCarousel = async (req, res) => {
  try {
    upload.single("fileName")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const fileName = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null;

      const newPost = new Carousel({
        fileName,
      });

      await newPost.save();
      res.status(201).json(newPost);
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при создании тренера",
      error: error.message,
    });
  }
};

export const getCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find();
    res.status(200).json(carousels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching carousel items", error });
  }
};

export const deleteCarousel = async (req, res) => {
  try {
    const deletedCarousel = await Carousel.findByIdAndDelete(req.params.id);
    if (!deletedCarousel)
      return res.status(404).json({ message: "NOT FOUND!" });

    if (deletedCarousel.fileName) {
      const slicedPhoto = deletedCarousel.fileName.slice(30);
      const filePath = path.join(__dirname, "..", "uploads", slicedPhoto);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      } catch (err) {
        console.error(`Failed to delete image: ${filePath}`, err);
      }
    }
    res.status(200).json({ message: "Carousel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting carousel item", error });
  }
};
