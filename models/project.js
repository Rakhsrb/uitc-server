import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
