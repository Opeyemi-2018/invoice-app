import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    StreetAddress: { type: String, required: true },
    ownersCity: { type: String, required: true },
    ownersPostcode: { type: Number, required: true },
    ownersCountry: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientAddress: { type: String, required: true },
    clientCity: { type: String, required: true },
    clientPostcode: { type: Number, required: true },
    clientCountry: { type: String, required: true },
    date: { type: Date, required: true },
    paymentTerm: { type: String, required: true },
    projectDescription: { type: String, required: true },
    itemName: { type: String, required: true },
    itemQuantity: { type: Number, required: true },
    itemPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending", // Default status to pending
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure this is required if every invoice must have a user reference
    },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
