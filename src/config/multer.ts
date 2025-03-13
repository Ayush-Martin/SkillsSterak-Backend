import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "dotenv";
import path from "path";
config();

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "media";
    let resourceType = "image";

    if (file.mimetype.startsWith("image")) {
      folder = "images";
      resourceType = "image";
    } else if (file.mimetype.startsWith("video")) {
      folder = "videos";
      resourceType = "video";
    } else if (file.mimetype === "application/pdf") {
      folder = "documents";
      resourceType = "raw";
    }

    return {
      folder: folder,
      resource_type: resourceType,
      public_id: `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`,
      allowed_formats:
        resourceType === "image"
          ? ["jpg", "jpeg", "png"]
          : resourceType === "video"
          ? ["mp4", "avi", "mov"]
          : ["pdf"],
    };
  },
});

const upload = multer({ storage });
/** multer middleware to handle file upload */
export default upload;
