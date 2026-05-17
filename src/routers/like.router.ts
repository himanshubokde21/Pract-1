import { Router } from "express"
import { likeVideo, likeComment, likeTweet} from "../controllers/like.controller.ts"
import { getAuth } from "../middlewares/auth.middleware.ts"
 
const router = Router()

router.route("/like-video").post(
    getAuth,
    likeVideo
)

router.route("/like-tweet").post(
    getAuth,
    likeTweet
)

router.route("/like-comment").post(
    getAuth,
    likeComment
)

export default router