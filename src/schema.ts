import * as p from 'drizzle-orm/pg-core'

const userTable = p.pgTable('User', {
    id: p.serial().primaryKey(),
    email: p.text().notNull().unique(),
    password: p.text().notNull(),
    fullName: p.text().notNull(),
    userName: p.text().unique().notNull(),
    subscriptionStatus: p.text().notNull(),
    createdAt: p.timestamp().notNull().defaultNow(),
    updatedAt: p.timestamp().notNull().$onUpdate(() => new Date()),
    profileImg: p.text().notNull()
})

const videoTable = p.pgTable('Video', {
    id: p.serial().primaryKey(),
    title: p.text().notNull().unique(),
    description: p.text(),
    videoFile: p.text().notNull(), 
    thumbnail: p.text().notNull(),
    viewCount: p.integer().notNull().default( 0 ),
    duration: p.integer().notNull()
})

export {
    userTable,
    videoTable
}