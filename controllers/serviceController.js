import Service from "../models/service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
    res.status(200).json({ data: services, total: services.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get one service
export const getOneService = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: "Not found!" });
    res.status(200).json({ data: service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create new service
export const createNewService = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newService = await Service({
      title,
      description,
    });
    await newService.save();
    return res.status(201).json({
      message: "Yangi xizmat yaratildi!",
      data: newService,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found!" });
    }
    res.status(200).json({
      message: "Service updated successfully!",
      data: updatedService,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete service
export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ message: "Not found!" });
    res.status(200).json({ message: "Xizmat o'chirildi!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
