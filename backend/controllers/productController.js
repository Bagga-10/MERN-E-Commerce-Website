import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.body;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !req.file:
        return res.status(400).json({ error: "Image is required" });
      case !brand:
        return res.status(400).json({ error: "Brand is required" });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required" });
      case !price:
        return res.status(400).json({ error: "Price is required" });
      case !description:
        return res.status(400).json({ error: "Description is required" });
      case !category:
        return res.status(400).json({ error: "Category is required" });
    }

    const product = new Product({ ...req.body, image: req.file.path });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

const updateProdctDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.body;

    //Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? {
          name: { $regex: req.query.keyword, $options: "i" },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });

    const product = await Product.find({});
    // res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.json(404);
      throw new Error("Product not found!");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Product not found!" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user.id,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();

      res.status(201).json({ message: "Review added" });
    } else {
      res.status(400);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const product = await Product.find(args);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
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
};
