import { and, eq, or } from "drizzle-orm";
import db from "../db";
import { commentTable, likeTable, tweetTable, videoTable } from "../schema";
import ApiError from "../utils/ApiError.util";
import Asynchandler from "../utils/AsyncHandler.util";
import { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse.util";

const likeVideo = Asynchandler(async (req: Request, res: Response) => {
    const videoId = parseInt(req.params?.[0])
    const userId = req.user?.id as string

    if (!videoId) {
        throw new ApiError(404, "Video Not Found!")
    }

    const [video] = await db
    .select({
        id: videoTable.id
    })
    .from(videoTable)
    .where(
        eq(videoTable.id, videoId)
    )

    let isLiked = null

    const [isAlreadyLike] = await db
    .select({
        user: likeTable.likedBy
    })
    .from(likeTable)
    .where(
        and(
            eq(likeTable.video, video.id),
            eq(likeTable.likedBy, userId)
        )
    )

    if (isAlreadyLike) {
        await db
        .delete(likeTable)
        .where(
            and(
                eq(likeTable.video, video.id),
                eq(likeTable.likedBy, userId)
            )
        )

        isLiked = false
    }

    else {
        const [like] = await db
        .insert(likeTable)
        .values({
            likedBy: userId,
            video: video.id

        })
        .returning()
        
        if (!like) {
            throw new ApiError(400, "Unable to Like the Video!")
        }

        isLiked = true
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            { Liked: isLiked }, 
            isLiked
                    ? "Video liked successfully!"
                    : "Video unliked successfully!")
    )
    
})

const likeComment = Asynchandler(async (req: Request, res: Response) => {
    const commentId = parseInt(req.params?.[0])
    const userId = req.user?.id as string

    if (!commentId) {
        throw new ApiError(404, "Comment Not Found!")
    }

    const [comment] = await db
    .select({
        id: commentTable.id
    })
    .from(commentTable)
    .where(
        and(
            eq(commentTable.id, commentId),
            eq(commentTable.owner, userId)
        )
    )

    if (!comment) {
        throw new ApiError(404, "Comment Not Found!")
    }    

    const [isCommentLiked] = await db
    .select({
        user: likeTable.likedBy
    })
    .from(likeTable)
    .where(
        and(
            eq(likeTable.likedBy, userId),
            eq(likeTable.comment, comment.id)
        )
    )
    
    let isLiked = null

    if (isCommentLiked) {
        await db
        .delete(likeTable)
        .where(
            and(
                eq(likeTable.likedBy, userId),
                eq(likeTable.comment, comment.id)
            )
        )
        .returning()

        isLiked = false
    }

    else {
        const [likedComment] = await db
        .insert(likeTable)
        .values({
            likedBy: userId,
            comment: comment.id
        })
        .returning()

        if (!likedComment) {
            throw new ApiError(400, "Falied to Like Comment!")
        }

        isLiked = true
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            { Liked: isLiked }, 
            isLiked
                ? "Comment Liked Successfully!"
                : "Comment Unliked Successflly!"
        )
    )
})

const likeTweet = Asynchandler(async (req: Request, res: Response) => {
    const tweetId = parseInt(req.params?.[0])
    const userId = req.user?.id as string

    if (!tweetId) {
        throw new ApiError(404, "Tweet Not Found!")
    }

    const [tweet] = await db
    .select({
        id: tweetTable.id
    })
    .from(tweetTable)
    .where(
        and(
            eq(tweetTable.id, tweetId),
            eq(tweetTable.owner, userId)
        )
    )

    if (!tweet) {
        throw new ApiError(404, "Tweet Not Found!")
    }

    const isTweetLiked = await db
    .select({
        user: likeTable.likedBy
    })
    .from(likeTable) 
    .where(
        and(
            eq(likeTable.tweet, tweetId),
            eq(likeTable.likedBy, userId)
        )
    )

    let isLiked = null
    if (isTweetLiked) {
        await db 
        .delete(likeTable)
        .where(
            and(
                eq(likeTable.tweet, tweetId),
                eq(likeTable.likedBy, userId)
            )
        )

        isLiked = false
    }

    else {
        const [likedTweet] = await db
        .insert(likeTable)
        .values({
            likedBy: userId,
            tweet: tweet.id
        })
        .returning()

        if (!likedTweet) {
            throw new ApiError(400, "Falied to Like Tweet!")
        }

        isLiked = true
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            { Liked: isLiked }, 
            isLiked
                ? "Tweet Liked Successfully!"
                : "Tweet Unliked Successfully!"
            )
    )
})

export {
    likeVideo,
    likeComment,
    likeTweet
}

