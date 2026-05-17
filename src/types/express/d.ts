import { Request } from "express"
import { userTable } from "../../schema.ts"

type AuthenticatedUser = Pick<
    typeof userTable.$inferInsert,
    "id" | "email" | "userName" | "fullName" | "accessToken" | "refreshToken"
>



declare global {
    namespace Express {

        interface Request {
            user?: AuthenticatedUser
        }
    }
}

export {}