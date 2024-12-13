CREATE TYPE "public"."providers" AS ENUM('Gituhb', 'Microsoft');--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "microsoft_id" TO "provider_id";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "provider_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_name" "providers" NOT NULL;