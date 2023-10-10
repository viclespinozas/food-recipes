require('dotenv').config();
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'doxcdijnp',
    api_key: '937721645959596',
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const storage = cloudinaryStorage({
//     cloudinary,
//     folder: 'food-recipes',
//     allowedFormats: ['jpeg', 'jpg', 'png'],
//     filename: function(req, file, cb) {
//         let buf = crypto.randomBytes(16);
//         buf = buf.toString('hex');
//         let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
//         uniqFileName += buf;
//         cb(undefined, uniqFileName);
//     }
// });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'food-recipes',
        format: async (req, file) => ['jpeg', 'jpg', 'png'], // supports promises as well
        public_id: (req, file) => 'computed-filename-using-request',
    },
});

module.exports = {
    cloudinary,
    storage
}