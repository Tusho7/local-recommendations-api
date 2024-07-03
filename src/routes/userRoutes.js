import express from "express";
import * as userController from "../controllers/userController.js";
import multer from "multer";
import { fileStorage, fileFilter } from "../utils/multer.js";

const router = express.Router();

router.post(
  "/register",
  multer({ storage: fileStorage, fileFilter }).single("profilePicture"),
  userController.createUser
);

export default router;
