CREATE TABLE "User" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"fullName" varchar NOT NULL,
	"userName" varchar NOT NULL,
	"subscriptionStatus" varchar DEFAULT 'free',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"profileImg" varchar NOT NULL,
	"accessToken" varchar,
	"refreshToken" varchar,
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_userName_unique" UNIQUE("userName")
);
--> statement-breakpoint
CREATE TABLE "Video" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"videoFile" varchar NOT NULL,
	"thumbnail" varchar NOT NULL,
	"viewCount" integer DEFAULT 0 NOT NULL,
	"duration" integer NOT NULL,
	CONSTRAINT "Video_title_unique" UNIQUE("title")
);
