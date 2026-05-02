import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { db } from '../db'
import { userTable } from '../schema'
import { eq } from 'drizzle-orm'
import ApiError from './ApiError.util'




export const generateAccessToken = async (userId: number) => {
    const [user] = await db.select({
        id: userTable.id,
        userName: userTable.userName, 
        fullName: userTable.fullName, 
        email: userTable.email
    })
    .from(userTable)
    .where(eq(userTable.id, userId))

    if (!user){
        throw new ApiError(400, "user not found!")
    }

    return jwt.sign(
        {
            id: user.id,
            userName: user.userName, 
            fullName: user.fullName,
            email: user.email,
        },
        process.env.JWT_SECRET as Secret,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn']
        }
    );
};




export const generateRefreshToken = async (userId: number) => {
    const [user] = await db.select({
        id: userTable.id
    })
    .from(userTable)
    .where(eq(userTable.id, userId))

    if (!user){
        throw new ApiError(400, "user not found!")
    }

    return jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as Secret,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn']}
    )
}