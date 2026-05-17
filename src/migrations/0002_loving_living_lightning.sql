ALTER TABLE "Video" ADD COLUMN "isPubllished" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "Video" ADD COLUMN "owner" varchar;--> statement-breakpoint
ALTER TABLE "Video" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Video" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Video" ADD CONSTRAINT "Video_owner_User_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;