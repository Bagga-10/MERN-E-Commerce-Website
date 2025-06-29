import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Default storage for general uploads
const defaultStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Bagga-Store/bagga_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});


// Profile image storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Bagga-Store/user_profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `profile-${req.user._id}-${Date.now()}`,
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  },
});


const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only (jpg, jpeg, png, webp)"), false);
  }
};

const upload = multer({ storage: defaultStorage, fileFilter });
const profileUpload = multer({ storage: profileStorage, fileFilter });

export default upload;
export { profileUpload };
