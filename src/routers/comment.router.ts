import { Router } from "express"
import { addComment, deleteComment, editComment } from "../controllers/comment.controller.ts"
import { getAuth } from "../middlewares/auth.middleware.ts"

const router = Router()

router.route("/add-comment").post(
    getAuth, 
    addComment
)

router.route("/remove-comment").post(
    getAuth,
    deleteComment
)

router.route("/edit-comment").post(
    getAuth,
    editComment
)

export default router

