import { v2 as cloudinary } from "cloudinary";
import ApiError from "./ApiError.util";
import * as fs from 'fs';
import path from 'path';

const uploadOnCloudinary = async (localFilePath: string) => {
    if (!localFilePath) return null;

    const resolvedPath = path.resolve(localFilePath);
    if (!fs.existsSync(resolvedPath)) {
        throw new ApiError(400, `File not found: ${resolvedPath}`);
    }

    try {
        const res = await cloudinary.uploader.upload(resolvedPath, {
            resource_type: 'auto',
        });

        if (!res) {
            throw new ApiError(500, "Failed to Upload on Cloud!");
        }

        console.log("image uploaded successfully: ", res.url);
        try { fs.unlinkSync(resolvedPath); } catch {}

        return res;
    }
    catch (error: any) {
        if (fs.existsSync(resolvedPath)) {
            try { fs.unlinkSync(resolvedPath); } catch {}
        }
        throw new ApiError(400, error?.message || "Something went wrong");
    }
}

export default uploadOnCloudinary
