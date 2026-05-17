import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import db from "../db.ts"
import { userTable } from "../schema.ts"
import { eq } from "drizzle-orm"
import Asynchandler from "../utils/AsyncHandler.util.ts"
import ApiError from "../utils/ApiError.util.ts"

const getAuth = Asynchandler(async (req: Request, _: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")


    if (!token) {
        throw new ApiError(400, "Unauthorized Access")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string || "") as jwt.JwtPayload

    const [user] = await db
    .select({
        id: userTable.id,
        email: userTable.email,
        userName: userTable.userName,
        fullName: userTable.fullName
    })
    .from(userTable)
    .where(eq(userTable.id, decoded.id))

    if (!user) {
        return next(new Error("User not Found!"))
    }

    req.user = user 
    next()
})

export {getAuth}