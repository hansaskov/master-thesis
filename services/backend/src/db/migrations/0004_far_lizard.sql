ALTER TABLE "public"."users" ALTER COLUMN "provider_name" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."providers";--> statement-breakpoint
CREATE TYPE "public"."providers" AS ENUM('Github', 'Microsoft');--> statement-breakpoint
ALTER TABLE "public"."users" ALTER COLUMN "provider_name" SET DATA TYPE "public"."providers" USING "provider_name"::"public"."providers";