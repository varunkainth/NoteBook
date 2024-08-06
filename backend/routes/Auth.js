import { Router } from "express";
import { AuthLogin, AuthLogout, AuthRegister } from "../controllers/Auth.js";
const router = Router();

router.route("/register").post(AuthRegister)
router.route("/login").post(AuthLogin)
router.route("/logout").get(AuthLogout)

export default router;
