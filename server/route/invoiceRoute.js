import express from "express";
import { verifyToken } from "../verifyToken.js";
import { Invoice } from "../models/invoiceModel.js";

const router = express.Router();

router.post("/createinvoice", verifyToken, async (req, res) => {
  if (!req.user) {
    return res
      .status(403)
      .json({ message: "access deniend, you have to login" });
  }
  if (!req.body) {
    return res.status(400).json({ message: "all fields are required" });
  }
  try {
    const newInvoice = await Invoice.create({
      ...req.body,
      status: "pending", // Default status
      userRef: req.user.id, // Set the userRef to the logged-in user's ID
    });
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

router.get("/fetch/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ message: "invoice not found" });
    return res.status(200).json(invoice);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const invoiceId = await Invoice.findById(req.params.id);
    if (!invoiceId) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await Invoice.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Invoice successfully deleted" });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/edit/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const invoiceId = await Invoice.findById(id);
  if (!invoiceId) {
    return res.status(404).json({ message: "invoice not found" });
  }
  try {
    const editInvoice = await Invoice.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(editInvoice);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
});

router.put("/update-status/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const invoiceId = await Invoice.findById(id);
    if (!invoiceId) {
      return res.status(404).json({ message: "invoice not found" });
    }
    if (invoiceId.status === "paid") {
      return res.status(400).json({ message: "invoice already paid" });
    }
    invoiceId.status = "paid";
    await invoiceId.save();
    return res
      .status(200)
      .json({ message: "Invoice status updated to paid", invoiceId });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
