import multer from 'multer';
// import createHttpError from 'http-errors';
// const fileFilter = (req, file, cb) => {
//   if (/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) return cb(null, true);
//   cb(new createHttpError.BadRequest('Only image files (jpg/png/webp/gif) are allowed'));
// };
// export const upload = multer({ dest:'tmp/' });
// // export const upload = multer({
// //   storage,
// //   fileFilter,
// //   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// // });
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype?.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // до 5МБ
});
