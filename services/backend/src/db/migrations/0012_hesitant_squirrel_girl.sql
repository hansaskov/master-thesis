ALTER TABLE "invites" DROP CONSTRAINT "invites_inviter_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "invites" ALTER COLUMN "inviter_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;