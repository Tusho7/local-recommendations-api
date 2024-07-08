import express from "express"
import { createAdmin, getAdmin, loginAdmin, logoutAdmin } from "../controllers/adminController.js";
import { adminMiddleware } from "../middlewares/auth.js";

const router = express();

router.post("/register_admin", createAdmin)
router.post("/login_admin", loginAdmin)
router.post("/logout_admin", logoutAdmin)

router.get("/get_admin", adminMiddleware, getAdmin)

export default router