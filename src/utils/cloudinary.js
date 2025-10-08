import { v2 as cloudinary } from 'cloudinary';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    });
    export async function uploadImageBuffer(buffer, filename){
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: CLOUDINARY_FOLDER, public_id: filename, resource_type: 'image'    },
                (error, result) => { error ? reject(error) : resolve(result); });
            stream.end(buffer);
        });
    }
