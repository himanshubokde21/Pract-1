import { pgTable, uuid, varchar, integer, timestamp, serial } from 'drizzle-orm/pg-core'

const userTable = pgTable('User', {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    fullName: varchar("fullName").notNull(),
    userName: varchar("userName").unique().notNull(),
    subscriptionStatus: varchar("subscriptionStatus").default('free'),
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
    viewCount: integer("viewCount").notNull().default( 0 ),
    duration: integer("duration").notNull()
})

export {
    userTable,
    videoTable
}