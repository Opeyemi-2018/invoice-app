import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import userRoute from "./route/userRoute.js";
import invoiceRoute from "./route/invoiceRoute.js";
import cors from "cors";
import bodyParser from "body-parser";
dotenv.config();

let app = express();
// Increase the body size limit
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());
app.use(cookieparser());

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend's origin
    credentials: true,
  })
);

mongoose.connect(process.env.DB_URL).then(() => {
  app.listen(2000, () => {
    console.log("server connected to database");
  });
});

app.use("/api/auth", userRoute);
app.use("/api/invoice", invoiceRoute);
