CREATE TABLE "invites" (
	"organization_id" text NOT NULL,
	"inviter_id" text NOT NULL,
	"email" text NOT NULL,
	"role" "users_to_provider_roles" NOT NULL,
	CONSTRAINT "invites_organization_id_inviter_id_pk" PRIMARY KEY("organization_id","inviter_id")
);
--> statement-breakpoint
ALTER TABLE "system_models" ALTER COLUMN "name" SET DATA TYPE system_models_enum;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;