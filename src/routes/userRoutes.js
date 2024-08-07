import express from "express";
import * as userController from "../controllers/userController.js";
import multer from "multer";
import { fileStorage, fileFilter } from "../utils/multer.js";
import { middleware } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/register",
  multer({ storage: fileStorage, fileFilter }).single("profilePicture"),
  userController.createUser
);

router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.post("/forgot-password", userController.forgotPassword);
router.put("/:id", userController.updateUser);
router.get("/verify", userController.verifyUser);
router.get("/get_user", middleware, userController.getUser);

router.get("/total_users", userController.totalUsers);
router.get("/users", userController.getUsers);

router.patch("/block_unblock/:id", userController.toggleBlockUser);
router.delete("/delete_user/:id", userController.deleteUserByid);

export default router;
