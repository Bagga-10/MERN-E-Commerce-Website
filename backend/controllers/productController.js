import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.body;

    //Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !description:
        return res.status(400).json({ error: "Description is required" });
      case !price:
        return res.status(400).json({ error: "Price is required" });
      case !category:
        return res.status(400).json({ error: "Category is required" });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required" });
      case !brand:
        return res.status(400).json({ error: "Brand is required" });
      case !req.file:
        return res.status(400).json({ error: "Image is required" });
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      quantity: Number(quantity),
      brand,
      image: req.file.path, // Cloudinary URL
      countInStock: Number(quantity),
    };

    const product = new Product(productData);

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error in addProduct:", error.message);

    // Check for specific error types
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        details: Object.keys(error.errors).map((key) => ({
          field: key,
          message: error.errors[key].message,
        })),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate entry" });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
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

    // Find the existing product
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updateData = {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock: quantity,
    };

    if (req.file) {
      if (existingProduct.image) {
        try {
          // Extract public_id from Cloudinary URL
          const urlParts = existingProduct.image.split("/");
          console.log("Update - Full URL parts:", urlParts);

          // Find the upload index and extract everything after it
          const uploadIndex = urlParts.findIndex((part) => part === "upload");
          if (uploadIndex === -1) {
            throw new Error("Invalid Cloudinary URL format");
          }

          // Skip version number if present (starts with 'v' followed by numbers)
          let startIndex = uploadIndex + 1;
          if (urlParts[startIndex] && /^v\d+$/.test(urlParts[startIndex])) {
            startIndex++;
          }

          // Get all parts from folder to filename and remove extension
          const pathParts = urlParts.slice(startIndex);
          const fullPath = pathParts.join("/");
          const publicId = fullPath.replace(/\.[^/.]+$/, ""); // Remove extension

          console.log("Update - Deleting old product image:", publicId);
          const result = await cloudinary.uploader.destroy(publicId);
          console.log("Old image deletion result:", result);
        } catch (cloudinaryError) {
          console.error("Error deleting old image:", cloudinaryError.message);
        }
      }

      updateData.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    // First find the product to get image info
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Extract public_id from Cloudinary URL to delete the image
    if (product.image) {
      try {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/Bagga-Store/bagga_uploads/image-timestamp.jpg
        const urlParts = product.image.split("/");
        console.log("Full URL parts:", urlParts);

        // Find the upload index and extract everything after it
        const uploadIndex = urlParts.findIndex((part) => part === "upload");
        if (uploadIndex === -1) {
          throw new Error("Invalid Cloudinary URL format");
        }

        // Skip version number if present (starts with 'v' followed by numbers)
        let startIndex = uploadIndex + 1;
        if (urlParts[startIndex] && /^v\d+$/.test(urlParts[startIndex])) {
          startIndex++;
        }

        // Get all parts from folder to filename and remove extension
        const pathParts = urlParts.slice(startIndex);
        const fullPath = pathParts.join("/");
        const publicId = fullPath.replace(/\.[^/.]+$/, ""); // Remove extension

        console.log("Extracted public_id:", publicId);

        // Delete image from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary deletion result:", result);

        if (result.result === "ok") {
          console.log("✅ Image deleted from Cloudinary successfully");
        } else {
          console.log(
            "⚠️ Image might not exist in Cloudinary or already deleted"
          );
        }
      } catch (cloudinaryError) {
        console.error(
          "❌ Error deleting image from Cloudinary:",
          cloudinaryError.message
        );
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete the product from database
    await Product.findByIdAndDelete(req.params.id);

    console.log("✅ Product deleted successfully");
    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: {
        id: product._id,
        name: product.name,
      },
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
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
