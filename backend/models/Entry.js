import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    mood: {
      type: String,
      enum: ["happy", "sad", "neutral", "excited", "anxious", "grateful", "tired"],
      default: "neutral", 
    },
    tags: {
      type: [String],
      default: [],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
    weather: {
      type: String, 
      default: "",
    },
  },
  { timestamps: true }
);

entrySchema.index({ title: "text", content: "text", tags: "text" });

const Entry = mongoose.model("Entry", entrySchema);
export default Entry;
