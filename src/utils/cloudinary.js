import { v2 as cloudinary } from 'cloudinary';

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
// export async function uploadToCloudinary(buffer, filename) {
// //   const res = await cloudinary.uploader.upload_stream({
// //     resource_type: 'image',
// //     folder: 'contacts',
// //     filename_override: filename,
// //     use_filename: true,
// //     unique_filename: true,
// //     overwrite: false,
// //   },stream.end(buffer) );


// //   return { secureUrl: res.secure_url };
// // }
