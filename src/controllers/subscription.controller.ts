import db from "../db";
import { subscriptionTable } from "../schema";
import ApiError from "../utils/ApiError.util";
import Asynchandler from "../utils/AsyncHandler.util";
import { Request, Response } from "express";
import { eq, and, sql } from "drizzle-orm"
import ApiResponse from "../utils/ApiResponse.util";

const toggleSubscription = Asynchandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as string
    const channelId = req.params?.channelId as string

    if (!channelId) {
        throw new ApiError(404, "Channel Not Found!")
    }

    if (userId == channelId) {
        throw new ApiError(400, "User Cannot Subscribe Itself!")
    }

    let isSubscribed: boolean

    const [alreadySubscribed] = await db
    .select({
        id: subscriptionTable.id
    })
    .from(subscriptionTable)
    .where(
        and(
            eq(subscriptionTable.subscriber, userId),
            eq(subscriptionTable.channel, channelId)
        )
    )

    if (!alreadySubscribed) {
        const [newSubscribe] = await db
        .insert(subscriptionTable)
        .values({
            subscriber: userId,
            channel: channelId
        })
        .returning()

        if (!newSubscribe) {
            throw new ApiError(500, "Failed to Subscribe Channel!")
        }

        isSubscribed = true
    }

    else {
        await db
        .delete(subscriptionTable)
        .where(
            and(
            eq(subscriptionTable.subscriber, userId),
            eq(subscriptionTable.channel, channelId)
        )
        )

        isSubscribed = false
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            { Subscribed: isSubscribed },
            isSubscribed 
                ? "Subscribed Successfully!"
                : "Unubscribed Successfully!"
        )
    )
})

const getAllChannels = Asynchandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as string

    const channels = await db
    .select({
        id: subscriptionTable.id,
        channel: subscriptionTable.channel
    })
    .from(subscriptionTable)
    .where(
        eq(subscriptionTable.subscriber, userId)
    ) 

    return res
    .status(200)
    .json(
        new ApiResponse(200, { channelCount: channels.length, channels: channels }, "Successfully Fetched!")
    )
})

const getAllSubscribers = Asynchandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as string

    const subscribers = await db
    .select({
        id: subscriptionTable.id,
        subscriber: subscriptionTable.subscriber
    })
    .from(subscriptionTable)
    .where(
        eq(subscriptionTable.channel, userId)
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, { subscriptionCount: subscribers.length, subscribers: subscribers }, "Successfully Fetched!")
    )
})

export {
    toggleSubscription,
    getAllChannels,
    getAllSubscribers
}