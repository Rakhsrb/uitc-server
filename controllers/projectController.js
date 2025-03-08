import Project from "../models/project.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllProjects = async (req, res) => {
  try {
    let { page = 1, pageSize = 6, category } = req.query;
    page = Number(page);
    pageSize = Number(pageSize);

    const categoryRegExp = category ? new RegExp(category, "i") : /.*/;

    const projects = await Project.find({
      category: categoryRegExp,
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Project.countDocuments({
      category: categoryRegExp,
    });

    res.status(200).json({ data: projects, total, page, pageSize });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Not found!" });
    res.status(200).json({ data: project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewProject = async (req, res) => {
  try {
    const { title, description, category, images, url } = req.body;
    const newProject = await Project({
      title,
      description,
      category,
      images,
      url,
    });
    await newProject.save();
    return res.status(201).json({
      message: "Yangi loyiha yaratildi!",
      data: newProject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updateProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updateProject) return res.status(404).json({ message: "Not found!" });
    res.status(200).json({
      message: "Loyiha yangilandi!",
      data: updateProject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Not found!" });
    if (project.images && project.images.length > 0) {
      project.images.forEach((image) => {
        const slicedImage = image.slice(30);
        const filePath = path.join(__dirname, "..", "uploads", slicedImage);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          } else {
            console.warn(`File not found: ${filePath}`);
          }
        } catch (err) {
          console.error(`Failed to delete image: ${filePath}`, err);
        }
      });
    }
    const deletedProduct = await Project.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Loyiha o'chirildi!", deletedProduct });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
