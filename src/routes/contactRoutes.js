import express from "express";
import { transporter } from "../utils/contactAdmin.js   ";

const router = express.Router();

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_TO,
    subject: `ახალი სმს ${name} - სგან`,
    text: `სახელი: ${name}\nელ-ფოსტა: ${email}\nსმს: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

router.post("/request_to_add_category", async (req, res) => {
  const { categoryName, email, comment } = req.body;

  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_TO,
    subject: `ახალი კატეგორიის დამატების მოთხოვნა`,
    text: `კატეგორიის სახელი: ${categoryName}\nელ-ფოსტა: ${email}\nკომენტარი: ${comment}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

export default router;
