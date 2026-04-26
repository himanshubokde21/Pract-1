CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"fullName" text NOT NULL,
	"subscriptionStatus" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Video" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"videoFile" text NOT NULL,
	"thumbnail" text NOT NULL,
	"viewCount" integer DEFAULT 0 NOT NULL,
	"duration" integer NOT NULL,
	CONSTRAINT "Video_title_unique" UNIQUE("title")
);
