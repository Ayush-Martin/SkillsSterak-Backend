import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import envConfig from "./env";

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
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

