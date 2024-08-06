import { Router } from "express";
import {
  deleteUser,
  getUpdateDetails,
  getUpdateProfilePic,
} from "../controllers/User.js";

const router = Router();

router.route("/update").patch(getUpdateDetails);
router.route("/delete").delete(deleteUser);
router.route("/update/profile").patch(getUpdateProfilePic);

export default router;
