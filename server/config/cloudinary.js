const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "shopease",
    format: async (req, file) => "png",
    public_id: (req, file) => {
      return `product-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    },
  },
});

module.exports = { cloudinary, storage };