ALTER TABLE "User" ALTER COLUMN "subscriptionStatus" SET DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "subscriptionStatus" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "accessToken" text NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "refreshToken" text;