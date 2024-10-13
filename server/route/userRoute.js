import express from "express";
import { User } from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// sign up route
router.post("/signup", async (req, res) => {
  const { name, email, password, image } = req.body;

  const hashPassword = await bcryptjs.hash(password, 10);
  const newUser = User({
    name,
    email,
    password: hashPassword,
    image,
  });
  try {
    await newUser.save();
    return res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser)
      return res.status(404).json({ message: "Account does not exist" });
    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword)
      return res.status(400).json({ message: "Wrong credentials" });

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // secure only in production
        maxAge: 10 * 24 * 60 * 60 * 1000,
      }) // Expires after 7 days
      .status(200) // Set the response status code to 200
      .json({ message: "Login successfull", user: rest }); // Send the user data (excluding password) in the response
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// sign out route
router.get("/signout", async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "user successfully sign out" });
  } catch (error) {
    return res.status(500).json({ message: "internal serval errror" });
  }
});

// account delete route
router.delete("/delete/:id", verifyToken, async (req, res) => {
  if (req.user.id !== req.params.id)
    return res
      .status(401)
      .json({ message: "you can only delete your account" });
  let { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal serval errror" });
  }
});

export default router;
