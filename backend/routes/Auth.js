import { Router } from "express";
import { AuthLogin, AuthLogout, AuthRegister } from "../controllers/Auth.js";
import TokenVerification from "../middleware/TokenVerification.js";
const router = Router();

router.route("/register").post(AuthRegister)
router.route("/login").post(AuthLogin)
router.route("/logout").get(TokenVerification,AuthLogout)

export default router;
