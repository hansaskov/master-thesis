ALTER TABLE "users" RENAME COLUMN "name" TO "family_name";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" text;--> statement-breakpoint
UPDATE "users" SET "first_name" = '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "first_name" SET NOT NULL;