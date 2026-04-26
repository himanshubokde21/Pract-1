import { registerUser } from "../controllers/user.controller.ts"
import { Router } from 'express'
import { localUpload } from '../middlewares/multer.middleware.ts'


const router = Router()

router.route("/register").post(
    localUpload.fields([
        {
            name: "profileImg",
            maxCount: 1
        }
    ]),
    registerUser
)

