import { Router } from "express";
import {
  deleteUser,
  getUpdateDetails,
  getUpdateProfilePic,
} from "../controllers/User.js";
import TokenVerification from "../middleware/TokenVerification.js";
import upload from "../middleware/multer.js";


const router = Router();

router.route("/update").patch(TokenVerification, getUpdateDetails);
router.route("/delete").delete(TokenVerification, deleteUser);
router.route("/update/profile").patch(TokenVerification,upload.single("profilePic") ,getUpdateProfilePic);

export default router;
