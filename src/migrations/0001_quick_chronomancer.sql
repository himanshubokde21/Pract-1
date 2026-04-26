ALTER TABLE "User" ADD COLUMN "userName" text NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "profileImg" text NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_userName_unique" UNIQUE("userName");