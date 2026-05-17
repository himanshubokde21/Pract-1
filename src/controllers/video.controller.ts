import ApiError from "../utils/ApiError.util";
import Asynchandler from "../utils/AsyncHandler.util";
import { Request, Response } from "express";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/Cloudinary.util";
import db from "../db";
import { commentTable, likeTable, userTable, videoTable, subscriptionTable } from "../schema.ts";
import ApiResponse from "../utils/ApiResponse.util";
import { and, eq } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { MulterReq } from "../types/express/MulterReq";

const uploadVideo = Asynchandler(async (req: MulterReq, res: Response) => {
    const {title, description, } = req.body

    if (!title?.trim()) {
        throw new ApiError(400, "title is required!")
    }

    const videoFilePath = req.files?.videoFile?.[0].path
    const thumbnailPath = req.files?.thumbnail?.[0].path

    if (!videoFilePath || !thumbnailPath) {
        throw new ApiError(400, "video file and thumbnail are required!")
    }

    const [videoUrl, thumbnailUrl] = await Promise.all([
        uploadOnCloudinary(videoFilePath),
        uploadOnCloudinary(thumbnailPath)

    ])

    if (!videoUrl || !thumbnailUrl) {
        if (videoUrl) {
            await deleteFromCloudinary(videoUrl.public_id)
        }

        throw new ApiError(400, "Failed to upload on cloudinary!")
    }

    const [video] = await db
    .insert(videoTable)
    .values({
        title: title as string,
        description: description || "" as string,
        videoFile: videoUrl.url as string,
        thumbnail: thumbnailUrl.url as string,
        videoId: videoUrl.public_id,
        thumbnailId: thumbnailUrl.public_id,
        duration: videoUrl.duration,
        owner: req.user?.id as string
    })
    .returning()

    if (!video) {
        throw new ApiError(400, "Faied to published Video!")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, video, "video uploaded successfuly!")
    )
})

const getVideoById = Asynchandler(async (req: Request, res: Response) => {
    const videoId = req.params[0]
    const currentUserId = req.user?.id

    if (!videoId?.trim()) {
        throw new ApiError(400, "Video id is required!")
    }

    const [video] = await db
        .select({
            id: videoTable.id,
            title: videoTable.title,
            description: videoTable.description,
            videoFile: videoTable.videoFile,
            thumbnail: videoTable.thumbnail,
            videoId: videoTable.videoId,
            thumbnailId: videoTable.thumbnailId,
            duration: videoTable.duration,
            viewsCount: videoTable.viewsCount,
            isPublished: videoTable.isPublished,
            createdAt: videoTable.createdAt,

            ownerId: userTable.id,
            ownerUsername: userTable.userName,
            ownerProfileImg: userTable.profileImg,
            ownerFullname: userTable.fullName,

            totalLikes: sql<number>`
                (
                    SELECT COUNT(*)
                    FROM ${likeTable}
                    WHERE ${likeTable.video} = ${videoTable.id}
                )
            `,

            totalComments: sql<number>`
                (
                    SELECT COUNT(*)
                    FROM ${commentTable}
                    WHERE ${commentTable.video} = ${videoTable.id}
                )
            `,

            totalSubscribers: sql<number>`
                (
                    SELECT COUNT(*)
                    FROM ${subscriptionTable}
                    WHERE ${subscriptionTable.channel} = ${userTable.id}
                )
            `,

            isLiked: sql<boolean>`
                EXISTS(
                    SELECT 1
                    FROM ${likeTable}
                    WHERE ${likeTable.video} = ${videoTable.id}
                    AND ${likeTable.likedBy} = ${currentUserId}
                )
            `,

            isSubscribed: sql<boolean>`
                EXISTS(
                    SELECT 1
                    FROM ${subscriptionTable}
                    WHERE ${subscriptionTable.channel} = ${userTable.id}
                    AND ${subscriptionTable.subscriber} = ${currentUserId}
                )
            `
        })
        .from(videoTable)
        .innerJoin(
            userTable,
            eq(userTable.id, videoTable.owner)
        )
        .where(
            eq(videoTable.videoId, videoId)
        )

    if (!video) {
        throw new ApiError(404, "Video not found!")
    }

    if (!video.isPublished && video.ownerId !== currentUserId) {
        throw new ApiError(403, "Video is not available!")
    }

    await db
        .update(videoTable)
        .set({
            viewsCount: sql`${videoTable.viewsCount} + 1`
        })
        .where(
            eq(videoTable.id, video.id)
        )

    const comments = await db
        .select({
            id: commentTable.id,
            content: commentTable.content,
            createdAt: commentTable.createdAt,

            ownerId: userTable.id,
            ownerUsername: userTable.userName,
            ownerAvatar: userTable.profileImg,

            totalLikes: sql<number>`
                (
                    SELECT COUNT(*)
                    FROM ${likeTable}
                    WHERE ${likeTable.comment} = ${commentTable.id}
                )
            `,

            isLiked: sql<boolean>`
                EXISTS(
                    SELECT 1
                    FROM ${likeTable}
                    WHERE ${likeTable.comment} = ${commentTable.id}
                    AND ${likeTable.likedBy} = ${currentUserId}
                )
            `
        })
        .from(commentTable)
        .innerJoin(
            userTable,
            eq(userTable.id, commentTable.owner)
        )
        .where(
            eq(commentTable.video, video.id)
        )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    video: {
                        id: video.id,
                        title: video.title,
                        description: video.description,
                        videoFile: video.videoFile,
                        thumbnail: video.thumbnail,
                        videoId: video.videoId,
                        duration: video.duration,
                        viewsCount: video.viewsCount + 1,
                        totalLikes: video.totalLikes,
                        totalComments: video.totalComments,
                        createdAt: video.createdAt,
                    },

                    owner: {
                        id: video.ownerId,
                        username: video.ownerUsername,
                        fullName: video.ownerFullname,
                        profileImg: video.ownerProfileImg,
                        totalSubscribers: video.totalSubscribers,
                        isSubscribed: video.isSubscribed,
                        isLiked: video.isLiked
                    },
                    comments
                },
                "Video fetched successfully!"
            )
        )
})

const updateVideo = Asynchandler(async (req: MulterReq, res: Response) => {
    const videoId = req.params?.videoId[0]
    
    if (!videoId) {
        throw new ApiError(401, "Video not Found!")
    }

    const newVideoPath = req.files?.videoFile?.[0]?.path
    const newThumbnailPath = req.files?.thumbnail?.[0]?.path

    if (!newVideoPath) {
        throw new ApiError(400, "Fields are Required!")
    }

    const user  = req.user?.id

    if (!user) {
        throw new ApiError(400, "User does not Exist!")
    }

    const [video] = await db
    .select({
        id: videoTable.id,
        owner: videoTable.owner,
        videoId: videoTable.videoId,
        thumbnailId: videoTable.thumbnailId
    })
    .from(videoTable)
    .where(
        eq(videoTable.id, parseInt(videoId))
    )

    if (!video) {
        throw new ApiError(401, "Video not Found!")
    }

    if (video.owner !== user) {
        throw new ApiError(400, "You don't have Permission!")
    }

    const [newVideoUrl, newThumbnailUrl] = await Promise.all([
        uploadOnCloudinary(newVideoPath!),
        newThumbnailPath?uploadOnCloudinary(newThumbnailPath!):null,
        
    ])

    if (!newVideoUrl) {
        throw new ApiError(400, "Something Went Wrong While Uploading On Cloudinary!")
    }

    await Promise.all([
        newVideoUrl?deleteFromCloudinary(video.videoId):video.videoId,
        newThumbnailUrl?deleteFromCloudinary(video.thumbnailId):video.thumbnailId
    ])

    const [newVideo] = await db
    .update(videoTable)
    .set({
        videoId: newVideoUrl?.public_id,
        thumbnailId: newThumbnailUrl?.public_id,
        videoFile: newVideoUrl?.url,
        thumbnail: newThumbnailUrl?.url,
        duration: newVideoUrl?.duration
    }) 
    .where(
        eq(videoTable.id, video.id)
    )
    .returning()

    if (!newVideo) {
        throw new ApiError(400, "Failed to Update new Video!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, newVideo, "Video Successfully Update!")
    )

})

const deleteVideo = Asynchandler(async (req: Request, res: Response) => {
    const videoId = req.params?.[0]

    if (!videoId) {
        throw new ApiError(404, "Video Not Found!")
    }
    
    const [video] = await db
    .select({
        id: videoTable.id,
        videoId: videoTable.videoId,
        thumbnailId: videoTable.thumbnailId,
    })
    .from(videoTable)
    .where(
        eq(videoTable.id, parseInt(videoId))
    )

    const [msg1, msg2] = await Promise.all([
        deleteFromCloudinary(video.videoId),
        deleteFromCloudinary(video.thumbnailId)
    ])
    
    if (!msg1 || !msg2) {
        throw new ApiError(500, "Failed to Delete Files from Cloudinary!")
    }

    await db
    .delete(videoTable)
    .where(
        eq(videoTable.videoId, videoId)
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, {},"Video Successfully Deleted!")
    )

})

const getAllVideos = Asynchandler(async (req: Request, res: Response) => {
    const page = Math.max(Number(req.query?.page) || 1, 1)
    const limit = Math.max(Number(req.query?.limit) || 10)

    const offset = (page - 1) * limit

    const videos = await db
    .select()
    .from(videoTable)
    .where(
        eq(videoTable.isPublished, true)
    )
    .limit(limit)
    .offset(offset)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {videos: videos}, "Videos Fetched!")
    )
    
})

const togglePublishStatus = Asynchandler(async(req: Request, res: Response) => {
    const videoId = req.params?.[0]
    const userId = req.user?.id as string

    if (!videoId) {
        throw new ApiError(404, "Video Not Found!")
    }

    const [updatedVideoDetails] = await db
    .update(videoTable)
    .set({
        isPublished: sql`NOT ${videoTable.isPublished}`
    })
    .where(
        and(
            eq(videoTable.id, parseInt(videoId)),
            eq(videoTable.owner, userId)
        )
    )
    .returning({
        id: videoTable.id
    })

    if (!updatedVideoDetails) {
        throw new ApiError(401, "Unauthorized Access!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Published Status Updated!")
    )
})

export {
    uploadVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getAllVideos,
    togglePublishStatus,
}