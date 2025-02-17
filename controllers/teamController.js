import Team from "../models/team.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// getAllMembers
export const getAllMembers = async (_, res) => {
  try {
    const team = await Team.find();
    return res.json({ data: team });
  } catch (err) {
    return res.json({ message: err });
  }
};

// getOneMember
export const getOneMembers = async (req, res) => {
  try {
    const memberData = await Team.findById(req.params.id);
    if (!memberData) return res.json({ message: "Member not found" });
    return res.json({ data: memberData });
  } catch (err) {
    return res.json({ message: err });
  }
};

// CreateMember
export const createMember = async (req, res) => {
  const { name, job, image } = req.body;
  try {
    const newMember = await Team({ name, job, image });
    await newMember.save();
    return res.json({
      data: newMember,
      message: "New member has been created",
    });
  } catch (err) {
    return res.json({ message: err });
  }
};

//  UpdateMember
export const updateMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!member) return res.json({ message: "Member not found" });
    return res.json({ data: member, message: "Member has been updated" });
  } catch (err) {
    return res.json({ message: err });
  }
};

//  DeleteMember
export const deleteMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.json({ message: "Member not found" });
    if (member.image) {
      const slicedPhoto = member.image.slice(30);
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
    };
  } catch (err) {
    return res.json({ message: err });
  }
};
