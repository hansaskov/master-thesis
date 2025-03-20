ALTER TABLE "users" RENAME COLUMN "name" TO "family_name";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" text NOT NULL;