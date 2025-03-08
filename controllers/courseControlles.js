import Course from "../models/course.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  getAllCourses
export const getAllCourses = async function (req, res) {
  try {
    const titleRegExp = new RegExp(req.query.title, "i");

    const courses = await Course.find({
      title: titleRegExp,
    });

    const total = await Course.countDocuments();
    return res.status(200).json({ data: courses, total });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//  getOneCourse
export const getOneCourse = async function (req, res) {
  try {
    const id = req.params.id;
    const course = await Course.findById(id);
    if (!course) return res.json({ message: "NOT FOUND" });
    return res.json({ data: course });
  } catch (err) {
    return res.json({ message: "xato" });
  }
};

// create new course
export const createNewCourse = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    const newCourse = await Course({
      title,
      description,
      price,
      image,
    });
    await newCourse.save();
    return res.status(201).json({
      message: "New Course Has Been Added!",
      data: newCourse,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update course
export const updateCourse = async (req, res) => {
  try {
    const updateCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updateCourse) return res.status(404).json({ message: "NOT FOUND!" });
    return res.status(200).json({
      message: "Course Has Been Updated!",
      data: updateCourse,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete Course
export const deleteCourse = async (req, res) => {
  try {
    const deleteCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deleteCourse) return res.status(404).json({ message: "NOT FOUND!" });

    if (deleteCourse.image) {
      const slicedPhoto = deleteCourse.image.slice(30);
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

    return res.status(200).json({ message: "Course Has Been Deleted!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
