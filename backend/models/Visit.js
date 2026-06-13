import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
