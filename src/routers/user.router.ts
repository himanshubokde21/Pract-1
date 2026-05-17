import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken,  
    changePassword,
    getCurrentuser,
    editDetails,
    changeProfileImage,
} from "../controllers/user.controller.ts"
import { Router } from 'express'
import localUpload from '../middlewares/multer.middleware.ts'
import { getAuth } from "../middlewares/auth.middleware.ts"


const router = Router()

router.route("/register").post(
    localUpload.single(
            'profileImg'
        ),
    registerUser
)
router.route("/logout").post(
    getAuth,
    logoutUser
)

router.route("/change-password").post(
    getAuth,
    changePassword
)

router.route("/getUser").post(
    getAuth,
    getCurrentuser
)

router.route("/edit-details").post(
    getAuth,
    editDetails
)

router.route("/change-profile-image").post(
    localUpload.single(
        "profieImg"
    ),
    getAuth,
    changeProfileImage
)

router.route("/login").post(loginUser)
router.route("/refresh-access-token").post(refreshAccessToken)



export default router 
