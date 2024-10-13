import express from "express";
import { verifyToken } from "../verifyToken.js";
import { Invoice } from "../models/invoiceModel.js";

const router = express.Router();

router.post("/createinvoice", verifyToken, async (req, res, next) => {
  if (!req.user) {
    return res
      .status(403)
      .json({ message: "access deniend, you have to login" });
  }
  if (!req.body) {
    return res.status(400).json({ message: "all fields are required" });
  }
  try {
    const newInvoice = await Invoice.create(req.body);
    return res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Error creating invoice:", error); // Log the error for debugging
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("/fetch", async (req, res) => {
  try {
    const invoice = await Invoice.find({});
    return res.status(200).json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error); // Log the error for debugging
    return res.status(500).json({ message: "internal server error" });
  }
});

export default router;
