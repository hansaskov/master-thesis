ALTER TABLE "invites" DROP CONSTRAINT "invites_email_organization_id_pk";--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "is_accepted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "expires_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "parts" ADD COLUMN "image" text;--> statement-breakpoint
CREATE INDEX "invites_email_organization_id_index" ON "invites" USING btree ("email","organization_id");--> statement-breakpoint
ALTER TABLE "system_models" ADD CONSTRAINT "system_models_name_unique" UNIQUE("name");