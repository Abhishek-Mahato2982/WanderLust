const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// In this we configure the details of our cloud
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,                 //CLOUD_NAME can be anything but the cloud_name is fixed
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png", "jpg", "jpeg"], // supports promises as well
  },
});

module.exports = {
    cloudinary,
    storage,
};