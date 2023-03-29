import express from "express";
import { getAllUsers, createUser, login } from "../controllers/users.js";
import { auth, authorize } from "./../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get(auth, authorize("user", "admin"), getAllUsers);
router.route("/").post(createUser);
router.route("/login").post(login);

export default router;
