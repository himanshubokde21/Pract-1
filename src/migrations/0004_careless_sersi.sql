CREATE TABLE "Comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" varchar NOT NULL,
	"video" varchar,
	"owner" varchar
);
--> statement-breakpoint
CREATE TABLE "Like" (
	"video" varchar,
	"likedBy" varchar,
	"comment" varchar,
	"tweet" varchar
);
--> statement-breakpoint
CREATE TABLE "Tweet" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" varchar NOT NULL,
	"owner" varchar
);
--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_video_Video_id_fk" FOREIGN KEY ("video") REFERENCES "public"."Video"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_owner_User_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_video_Video_id_fk" FOREIGN KEY ("video") REFERENCES "public"."Video"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_likedBy_User_id_fk" FOREIGN KEY ("likedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_comment_Comment_id_fk" FOREIGN KEY ("comment") REFERENCES "public"."Comment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_tweet_Tweet_id_fk" FOREIGN KEY ("tweet") REFERENCES "public"."Tweet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_owner_User_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;