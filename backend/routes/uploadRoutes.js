import express from "express";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        message: err.message,
        error: err.toString(),
      });
    }

    try {
      if (req.file && req.file.path) {
        res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: req.file.path, // Cloudinary URL
          publicId: req.file.filename, // Cloudinary public ID for deletion if needed
        });
      } else {
        res.status(400).json({ message: "No image file provided" });
      }
    } catch (error) {
      console.error("Processing error:", error);
      res.status(500).json({
        message: error.message,
        error: error.toString(),
      });
    }
  });
});

export default router;
