const multer = require('multer');
const moment = require('moment');
const path = require('path');

// ============================
// Configuring Multer
// ============================
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./assets/images"); 
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });

//const upload = multer({ storage: storage });
const multerStorage = multer.diskStorage({
  destination: (request, file, cb) => {
    console.log("file 1")
    cb(null, `${path.join(__dirname, '../assets/images')}`);
    console.log("file 2")
  },
  filename: (request, file, cb) => {
    console.log("file 3")
    const ext = file.mimetype.split('/')[1];
    cb(null, `image-${Date.now()}.${ext}`);
    console.log("file 4")
  },
});

const multerFilter = (request, file, cb) => {
  const allowedImageTypes = ['jpeg', 'jpg', 'png'];
  const allowedVideoTypes = ['mov', 'mp4'];

  const fileExtension = file.originalname.split('.').pop().toLowerCase();

  if (allowedImageTypes.includes(fileExtension)) {  
    console.log("file 5 - Image");
    cb(null, true);
  } else if (allowedVideoTypes.includes(fileExtension)) {
    console.log("file 5 - Video");
    cb(null, true);
  } else {
    cb(new Error('Allowed Extensions are JPEG JPG PNG MOV MP4'), false);
    console.log("file 7");
  }
};

const _fileUploader = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = _fileUploader;
