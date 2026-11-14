import express from "express";
import { register, login, me, logout } from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, me);
router.route("/logout").post(logout);

export default router;
