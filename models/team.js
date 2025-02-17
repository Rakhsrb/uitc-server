import mongoose from "mongoose";

const team = new mongoose.Schema({
  name: { type: String, required: true },
  job: { type: String, required: true },
  image: { type: String },
});

export default mongoose.model("Team", team);
