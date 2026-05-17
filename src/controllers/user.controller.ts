import Asynchandler from "../utils/AsyncHandler.util.ts"
import { userTable } from "../schema.ts";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError.util.ts";
import ApiResponse from "../utils/ApiResponse.util.ts"
import db from "../db.ts"
import { or, eq } from "drizzle-orm";
import { HashPassword } from "../utils/HashPassword.util.ts";
import { generateAccessToken, generateRefreshToken } from "../utils/generateAccessAndRefreshToken.util.ts";
import { uploadOnCloudinary } from "../utils/Cloudinary.util.ts";
import { compare } from "bcrypt"
import jwt from "jsonwebtoken";
import { options } from "../constant.ts"


const registerUser = Asynchandler(async (req: Request, res: Response) => {
        const { fullName, email, password, userName } = req.body 

        if ([fullName, email, password, userName].some((ele) => ele?.trim() === "")){
            throw new ApiError(400, "All fields are required!")
        }

        let existUser: any[] = []
        
        existUser = await db.query.userTable.findMany({
            columns: {
                id: true,
            },
            where: or(
                eq(userTable.email, email),
                eq(userTable.userName, userName)
            )
        })

        if (existUser.length > 0) {
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
            userName: userName as string,
            email: email as string,
            profileImg: profileImgUrl.url as string,
            password: hashedPassword as string,
            fullName: fullName as string,
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

        const newUser = await db.query.userTable.findFirst({
            columns: {
                id: true,
                email: true,
                userName: true,
                fullName: true,
                refreshToken: true,
                password: true,
                profileImg: true
            },
            where: eq(userTable.id, user.id)
        })

        return res
        .status(200)
        .json(
            new ApiResponse(200, newUser, "user created successfully!")
        )

})


const loginUser = Asynchandler(async (req: Request, res: Response) => {
    const {userName, email, password} = req.body

    if (!userName && !email) {
        throw new ApiError(400, "Email or Username is required!")
    }

    if (!password) {
        throw new ApiError(400, "Password is required")
    }

    const [user] = await db
    .select()
    .from(userTable)
    .where(
        or( 
            eq(userTable.email, email),
            eq(userTable.userName, userName)
        )
    )

    if (!user) {
        throw new ApiError(400, "Failed to get User!")
    }

    const hashedPassword = await HashPassword(password)

    if (!compare(hashedPassword, user.password)) {
        throw new ApiError(400, "Unauthorized Access!")
    }

    const refreshToken = await generateRefreshToken(user.id)
    const accessToken = await generateAccessToken(user.id)

    if (!accessToken) {
        throw new ApiError(400, "Failed to  generate Access Token!")
    }

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200, user, "User Logged In!")
    )

})

const logoutUser = Asynchandler(async (req: Request, res: Response) => {
    const user = req.user

    if (!user) {
        throw new ApiError(400, "Something went wrong!")
    }

    await db
    .update(userTable)
    .set({
        refreshToken: null
    })
    .where(
        eq(userTable.id, user.id as string)
    )

    return res
    .status(200)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(
        new ApiResponse(200, {}, "User Logged Out Successfully!")
    )

})

const refreshAccessToken = Asynchandler( async (req: Request, res:Response) => {
    const inRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!inRefreshToken) {
        throw new ApiError(401, "unauthorized access!")
    } 
    const decoded = jwt.verify(inRefreshToken, process.env.JWT_SECRET!) as jwt.JwtPayload

    const [user] = await db
    .select({
        refreshToken: userTable.refreshToken,
        id: userTable.id
    })
    .from(userTable)
    .where(
        eq(userTable.id, decoded.id)
    )
    
    if (!user) {
        throw new ApiError(401, "unauthorized access!")
    }

    if (inRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "unauthorized access!")
    }

    const newAccessToken = await generateAccessToken(decoded.id as string)

    return res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .json(
        new ApiResponse(200, {}, "New Access Token generated!")
    )
})

const changePassword = Asynchandler(async (req: Request, res:Response) => {
    const {oldPassword, newPassword, confirmPassword} = req.body

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All Fields are required!")
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Something went wrong!")
    }

    const [user] = await db
    .select({
        id: userTable.id,
        password: userTable.password
    })
    .from(userTable)
    .where(
        eq(userTable.id, req.user?.id!)
    )

    if (!compare(user.password, oldPassword)){
        throw new ApiError(400, "Unauthorized Access!")
    }

    const hashNewPassword = await HashPassword(newPassword as string)

    await db
    .update(userTable)
    .set({
        password: hashNewPassword
    })
    .where(
        eq(userTable.id, user.id)
    ).returning()

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password changed successfully!")
    )
    
})

const getCurrentuser = Asynchandler(async (req: Request, res: Response) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "User successfuly Fetched!")
    )
})

const editDetails = Asynchandler(async (req: Request, res: Response) => {
    const {fullName, email} = req.body

    if (!fullName || !email){
        throw new ApiError(400, "All Fields are required!")
    }

    const [user] = await db
    .update(userTable)
    .set({
        email: email,
        fullName: fullName
    })
    .where(
        eq(userTable.id, req.user?.id!)
    )
    .returning()

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Fields Successfully modified!")
    )
})

const changeProfileImage = Asynchandler(async (req: Request, res: Response) => {
    const newProfileImg = req.file?.path

    if (!newProfileImg) {
        throw new ApiError(400, "Profile Image path is Missing!")
    }

    const newProfileImgUrl = await uploadOnCloudinary(newProfileImg)

    if (!newProfileImgUrl) {
        throw new ApiError(400, "Failed to Upload on Cloudinary!")
    }

    const [user] = await db
    .update(userTable)
    .set({
        profileImg: newProfileImgUrl.url
    })
    .where(
        eq(userTable.id, req.user?.id!)
    ).returning({
        id: userTable.id,
        email: userTable.email,
        fullName: userTable.fullName,
        userName: userTable.userName,
        profileImg: userTable.profileImg,
        updatedAt: userTable.updatedAt
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Profile Image Updated Successfully!")
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentuser,
    editDetails,
    changeProfileImage,
}
