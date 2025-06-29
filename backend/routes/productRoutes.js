import express from "express";
import upload from "../middlewares/multer.js";

const router = express.Router();

//Controllers
import {
  addProduct,
  updateProdctDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router
  .route("/")
  .post(authenticate, authorizeAdmin, upload.single("image"), addProduct)
  .get(fetchProducts);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(
    authenticate,
    authorizeAdmin,
    upload.single("image"),
    updateProdctDetails
  )
  .delete(authenticate, authorizeAdmin, removeProduct);
router.route("/filtered-products").post(filterProducts);

export default router;
