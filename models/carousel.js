import mongoose from "mongoose";

const Carousel = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Carousel", Carousel);
