import { pgTable, uuid, varchar, integer, timestamp, serial, boolean, unique } from 'drizzle-orm/pg-core'

const userTable = pgTable('User', {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    fullName: varchar("fullName").notNull(),
    userName: varchar("userName").unique().notNull(),
    watchHistory: integer("watchHistory").array().default([]),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
    profileImg: varchar("profileImg").notNull(),
    accessToken: varchar("accessToken"),
    refreshToken: varchar("refreshToken")
})

const videoTable = pgTable('Video', {
    id: serial("id").primaryKey(),
    title: varchar("title").notNull().unique(),
    description: varchar("description"),
    videoFile: varchar("videoFile").notNull(), 
    thumbnail: varchar("thumbnail").notNull(),
    viewsCount: integer("viewsCount").notNull().default( 0 ),
    duration: integer("duration").notNull(),
    isPublished: boolean("isPublished").default(true),
    owner: uuid("owner").notNull().references(() => userTable.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()).defaultNow().notNull(),
    videoId: varchar("videoID").notNull(),
    thumbnailId: varchar("thumbnailID").notNull()
})

const commentTable = pgTable('Comment', {
    id: serial("id").primaryKey(),
    content: varchar("content").notNull(),
    video: integer("video").references(() => videoTable.id).notNull(),
    owner: uuid("owner").references(() => userTable.id).notNull(),
    createdAt: timestamp("createdAt").defaultNow()
})

const tweetTable = pgTable('Tweet', {
    id: serial("id").primaryKey(),
    content: varchar("content").notNull(),
    owner: uuid("owner").references(() => userTable.id).notNull()
})

const likeTable = pgTable('Like', {
    video: integer("video").references(() => videoTable.id),
    likedBy: uuid("likedBy").references(() => userTable.id),
    comment: integer("comment").references(() => commentTable.id),
    tweet: integer("tweet").references(() => tweetTable.id)
}, (table) => ({
    uniqueVideoLike: unique().on(table.video, table.likedBy),
    uniqueCommentLike: unique().on(table.comment, table.likedBy),
    uniqueTweetLike: unique().on(table.tweet, table.likedBy),
}))

const subscriptionTable = pgTable('Subscription', {
    id: serial("id").primaryKey(),
    subscriber: uuid("subscriber").references(() => userTable.id).notNull(),
    channel: uuid("channel").references(() => userTable.id).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull()
}, (table) => ({
    uniqueSubcription: unique().on(table.subscriber, table.channel)
}))

export {
    userTable,
    videoTable,
    commentTable,
    likeTable,
    tweetTable,
    subscriptionTable,
}