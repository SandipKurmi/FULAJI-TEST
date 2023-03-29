import express from "express";
import {
  createOrder,
  getAllOrder,
  getSingleOrder,
  deleteSingleOrder,
} from "../controllers/order.js";
import { auth, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(auth, authorize("user"), createOrder);
router.route("/").get(auth, authorize("user", "admin"), getAllOrder);
router.route("/:id").get(auth, authorize("user", "admin"), getSingleOrder);
router
  .route("/:id")
  .delete(auth, authorize("user", "admin"), deleteSingleOrder);

export default router;
