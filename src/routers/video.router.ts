import { Router } from 'express'
import localUpload from '../middlewares/multer.middleware.ts'
import { getAuth } from "../middlewares/auth.middleware.ts"


import { 
    uploadVideo, 
    getVideoById, 
    updateVideo, 
    deleteVideo, 
    getAllVideos,
    togglePublishStatus, 
} from '../controllers/video.controller.ts'

const router = Router()

router.route("/upload-video").post(
    getAuth,
    localUpload.fields([
        {name: "videoFile", maxCount: 1},
        {name: "thumbnail", maxCount: 1}
    ]),
    uploadVideo
)

router.route("/get-video").post(
    getAuth,
    getVideoById
)

router.route("/update-video").post(
    getAuth,
    updateVideo
)

router.route("/delete-video").post(
    getAuth,
    deleteVideo
)

router.route("/get-all-videos").post(
    getAllVideos
)

router.route("/change-published-status").post(
    getAuth,
    togglePublishStatus
)

export default router