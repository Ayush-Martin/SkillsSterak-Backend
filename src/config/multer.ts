import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import envConfig from "./env";

/**
 * Configure Cloudinary client using environment variables.
 */
cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
});

/**
 * CloudinaryStorage configuration for multer.
 *
 * Dynamically determines folder and resource type based on file MIME type:
 * - Images → "images" folder, type "image"
 * - Videos → "videos" folder, type "video"
 * - PDFs → "documents" folder, type "raw"
 *
 * Generates unique public IDs and restricts allowed formats per type.
 */
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
      folder,
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

/**
 * Multer middleware for handling file uploads with Cloudinary storage.
 */
const upload = multer({ storage });

export default upload;
