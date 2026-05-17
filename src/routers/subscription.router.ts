import { Router } from "express"
import { getAuth } from "../middlewares/auth.middleware.ts"
import { toggleSubscription, getAllChannels, getAllSubscribers } from "../controllers/subscription.controller"

const router = Router()

router.route("/subscribe").post(
    getAuth,
    toggleSubscription
)

router.route("/get-all-subscribers").post(
    getAuth, 
    getAllSubscribers
)

router.route("/get-all-channels").post(
    getAuth,
    getAllChannels
)

export default router