import Asynchandler from "../utils/AsyncHandler.util.ts"
import { userTable } from "../schema";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError.util.ts";
import ApiResponse from "../utils/ApiResponse.util.ts"
import { db } from "../db.ts"
import { or, eq } from "drizzle-orm";
import { HashPassword } from "../utils/HashPassword.util.ts";
import { generateAccessToken, generateRefreshToken } from "../utils/generateAccessAndRefreshToken.util.ts";
import { access } from "node:fs";
import uploadOnCloudinary from "../utils/CloudinaryUploader.util.ts";
import { UploadApiResponse } from "cloudinary";


const registerUser = Asynchandler(async (req: Request, res: Response) => {
        const { fullName, email, password, userName } = req.body 

        if ([fullName, email, password, userName].some((ele) => ele?.trim() === "")){
            throw new ApiError(400, "All fields are required!")
        }

        const existUser = await db.select()
        .from(userTable)
        .where(
            or (
                eq(userTable.userName, userName),
                eq(userTable.email, email)
            )
        )

        if (existUser.length > 0){
            throw new ApiError(409, "user already exist!")
        }

        const profileImgLocalPath = req.file?.path;
        if (!profileImgLocalPath) {
            throw new ApiError(400, "Profile Image is required!")
        }

        const profileImgUrl = await uploadOnCloudinary(profileImgLocalPath)
        if (!profileImgUrl) {
            throw new ApiError(400, "failed to upload on cloudinary!")
        }

        const hashedPassword = await HashPassword(password);
        console.log("Hased Passwrod: " + hashedPassword)

        const [user] = await db.insert(userTable).values({
            userName: userName,
            email: email,
            profileImg: profileImgUrl.url,
            password: hashedPassword,
            fullName: fullName,
        }).returning();

        if (!user) {
            throw new ApiError(400, "failed to create user in DB!")
        }

        const accessToken = await generateAccessToken(user.id);

        if (!accessToken) {
            throw new ApiError(400, "failed to generate access token!")
        }
        
        const refreshToken = await generateRefreshToken(user.id);

        const updateUser = await db.update(userTable)
        .set({ refreshToken: refreshToken })
        .where(eq(userTable.id, user.id))

        if(!updateUser) {
            throw new ApiError(400, "something went wrong!")
        }

        const newUser = await db.select({})

        return res
        .status(200)
        .json(
            new ApiResponse(200, user, "user created successfully!")
        )

})

export {
    registerUser,
}