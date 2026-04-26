import Asynchandler from "../utils/AsyncHandler.util.ts"
import { userTable } from "../schema";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError.util.ts";

const registerUser = Asynchandler(async (req: Request, res: Response) => {
        const { fullname, email, password, userName } = req.body 

        if ([fullname, email, password, userName].some((ele) => ele?.trim() === "")){
            throw new ApiError(400, "All fields are required!")
        }

        const existUser = userTable
        if (existUser){
            throw new ApiError(400, "user already exist!")
        }
})

export {
    registerUser,
}