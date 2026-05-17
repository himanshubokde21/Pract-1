import { eq, and } from "drizzle-orm"
import { Request, Response } from "express"
import Asynchandler from "../utils/AsyncHandler.util"
import ApiError from "../utils/ApiError.util"
import db from "../db"
import { commentTable, videoTable } from "../schema"
import ApiResponse from "../utils/ApiResponse.util"

const addComment = Asynchandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as string
    const { content } = req.body
    const videoId = req.params?.videoId as string
    
    if (!videoId?.trim()) {
        throw new ApiError(404, "Video Not Found!")
    }

    const [video] = await db
    .select()
    .from(videoTable)
    .where(
        eq(videoTable.id, parseInt(videoId))
    )

    if (!video) {
        throw new ApiError(404, "Video Not Found!")
    }

    if (content?.trim() == "") {
        throw new ApiError(400, "Content is Required!")
    }

    const [comment] = await db 
    .insert(commentTable)
    .values({
        content: content,
        video: video.id,
        owner: userId
    })
    .returning()

    if(!comment) {
        throw new ApiError(500, "Failed to Post Comment!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "Comment Posted!")
    )
})

const deleteComment = Asynchandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as string
    const commentId = req.params?.commentId as string

    if (!commentId?.trim()) {
        throw new ApiError(404, "Comment Not Found!")
    }

    const [deletedComment] = await db
    .delete(commentTable)
    .where(
        and(
            eq(commentTable.id, parseInt(commentId)), 
            eq(commentTable.owner, userId)
        )
    )
    .returning()

    if (!deletedComment) {
        throw new ApiError(500, "Failed to Delete Comment!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Comment Deleted Successfully!")
    )

})

const editComment = Asynchandler(async (req: Request, res:Response) => {
    const userId = req.user?.id as string
    const commentId = req.params?.commentId as string
    const { newContent } = req.body

    if (newContent?.trim()) {
        throw new ApiError(400, "Field Required!")
    }

    if (!commentId) {
        throw new ApiError(404, "Comment Not Found!")
    }

    const [updatedComment] = await db
    .update(commentTable)
    .set({
        content: newContent
    })
    .where(
        and(
            eq(commentTable.id, parseInt(commentId)), 
            eq(commentTable.owner, userId)
        )
    )
    .returning()

    if (!updatedComment) {
        throw new ApiError(500, "Failed to Update Comment!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, "Comment Updated Successfully!")
    )

})

export {
    addComment,
    editComment,
    deleteComment
}