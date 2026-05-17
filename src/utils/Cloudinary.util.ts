import { v2 as cloudinary } from "cloudinary";
import * as fs from 'fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

const deleteFromCloudinary = async(fileId: string) => {
    try {
        if (!fileId) return null
        await cloudinary.uploader.destroy(fileId)
        return 1
    } catch (error) {
        return null
    }
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}