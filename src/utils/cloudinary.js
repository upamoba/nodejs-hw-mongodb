import { v2 as cloudinary}  from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'contacts',
        resource_type: 'image',
        filename_override: filename,
        use_filename: true,
        unique_filename: true,
      },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    stream.end(buffer);
  })
};
