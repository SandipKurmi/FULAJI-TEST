import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.js";
import { auth, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/uploadimage.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(auth, authorize("admin"), upload.array("images", 5), createProduct);

router.route("/:id").get(auth, authorize("admin", "user"), getSingleProduct);
router.route("/").get(auth, authorize("admin", "user"), getAllProduct);
router
  .route("/:id")
  .put(auth, authorize("admin"), upload.array("images", 5), updateProduct);
router.route("/:id").delete(auth, authorize("admin"), deleteProduct);

export default router;
