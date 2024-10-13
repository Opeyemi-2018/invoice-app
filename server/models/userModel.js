import mongoose from "mongoose";
const userShema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: String,
  },
  { timestamps: true }
);

export let User = mongoose.model("User", userShema);
