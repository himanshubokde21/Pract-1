CREATE TABLE "Subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"subscriber" uuid NOT NULL,
	"channel" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Video" RENAME COLUMN "viewCount" TO "viewsCount";--> statement-breakpoint
ALTER TABLE "Video" RENAME COLUMN "isPubllished" TO "isPublished";--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "video" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "video" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "owner" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Comment" ALTER COLUMN "owner" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Like" ALTER COLUMN "video" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Like" ALTER COLUMN "video" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Like" ALTER COLUMN "likedBy" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Like" ALTER COLUMN "likedBy" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Like" ALTER COLUMN "comment" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Like" ALTER COLUMN "comment" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Like" ALTER COLUMN "tweet" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Like" ALTER COLUMN "tweet" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Tweet" ALTER COLUMN "owner" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Tweet" ALTER COLUMN "owner" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Video" ALTER COLUMN "owner" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Video" ALTER COLUMN "owner" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Comment" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "watchHistory" integer[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_subscriber_User_id_fk" FOREIGN KEY ("subscriber") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_channel_User_id_fk" FOREIGN KEY ("channel") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN "subscriptionStatus";--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_video_likedBy_unique" UNIQUE("video","likedBy");--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_comment_likedBy_unique" UNIQUE("comment","likedBy");--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_tweet_likedBy_unique" UNIQUE("tweet","likedBy");