import { v2 as cloudinary} from "cloudinary";
import ApiError from "./ApiError.util";
import * as fs from 'fs'

const uploadOnCloudinary = async (localFilePath: string) => {

    if (!localFilePath) {
            throw new ApiError(400, "missing file path!")
        }

    try {
        const res = await cloudinary.uploader.upload(localFilePath)
    
        if (!res) {
            throw new ApiError(500, "Failed to Upload on Cloud!")
        }
        
        console.log("image uploaded successfully: " + res)
        fs.unlinkSync(localFilePath)
    }
    catch (error: any) {
        fs.unlinkSync(localFilePath)
        throw new ApiError(400, error?.message || "something wnet wrong")
    }
}

export default uploadOnCloudinary