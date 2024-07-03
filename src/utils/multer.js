import multer from "multer";

export const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profilePictures");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const fileFilter = (_, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};