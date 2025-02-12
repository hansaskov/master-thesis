CREATE TYPE "public"."system_models_enum" AS ENUM('VisioPointer', 'VisioCompact', 'VisioLine', 'SmartInspector', '360 Inspector', 'VisioOne', 'IML-Inspector');--> statement-breakpoint
CREATE TYPE "public"."users_to_provider_roles" AS ENUM('Admin', 'User');--> statement-breakpoint
CREATE TYPE "public"."providers" AS ENUM('Github', 'Microsoft');--> statement-breakpoint
CREATE TABLE "factory_areas" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organization_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"email" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"inviter_id" text NOT NULL,
	"role" "users_to_provider_roles" DEFAULT 'User' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keys" (
	"public_key" text PRIMARY KEY NOT NULL,
	"private_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parts_to_system_models" (
	"part_id" text NOT NULL,
	"system_model_id" text NOT NULL,
	CONSTRAINT "parts_to_system_models_part_id_system_model_id_pk" PRIMARY KEY("part_id","system_model_id")
);
--> statement-breakpoint
CREATE TABLE "parts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "readings" (
	"time" timestamp with time zone NOT NULL,
	"system_id" text NOT NULL,
	"name" text NOT NULL,
	"value" real NOT NULL,
	"unit" text NOT NULL,
	CONSTRAINT "readings_time_system_id_name_pk" PRIMARY KEY("time","system_id","name")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_models" (
	"id" text PRIMARY KEY NOT NULL,
	"name" "system_models_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "systems_to_factory_areas" (
	"system_id" text NOT NULL,
	"factory_area_id" text NOT NULL,
	CONSTRAINT "systems_to_factory_areas_system_id_factory_area_id_pk" PRIMARY KEY("system_id","factory_area_id")
);
--> statement-breakpoint
CREATE TABLE "systems_to_parts" (
	"parts_id" text NOT NULL,
	"system_id" text NOT NULL,
	CONSTRAINT "systems_to_parts_system_id_parts_id_pk" PRIMARY KEY("system_id","parts_id")
);
--> statement-breakpoint
CREATE TABLE "systems" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"organization_id" text NOT NULL,
	"system_model" "system_models_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"theme" text NOT NULL,
	"product_updates" boolean NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_to_factory_areas" (
	"user_id" text NOT NULL,
	"factory_area_id" text NOT NULL,
	CONSTRAINT "users_to_factory_areas_user_id_factory_area_id_pk" PRIMARY KEY("user_id","factory_area_id")
);
--> statement-breakpoint
CREATE TABLE "users_to_organizations" (
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "users_to_provider_roles" NOT NULL,
	CONSTRAINT "users_to_organizations_organization_id_user_id_pk" PRIMARY KEY("organization_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"is_superadmin" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"provider_name" "providers" NOT NULL,
	"provider_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "factory_areas" ADD CONSTRAINT "factory_areas_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keys" ADD CONSTRAINT "keys_private_key_systems_id_fk" FOREIGN KEY ("private_key") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parts_to_system_models" ADD CONSTRAINT "parts_to_system_models_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parts_to_system_models" ADD CONSTRAINT "parts_to_system_models_system_model_id_system_models_id_fk" FOREIGN KEY ("system_model_id") REFERENCES "public"."system_models"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "systems_to_factory_areas" ADD CONSTRAINT "systems_to_factory_areas_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "systems_to_factory_areas" ADD CONSTRAINT "systems_to_factory_areas_factory_area_id_factory_areas_id_fk" FOREIGN KEY ("factory_area_id") REFERENCES "public"."factory_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "systems_to_parts" ADD CONSTRAINT "systems_to_parts_parts_id_parts_id_fk" FOREIGN KEY ("parts_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "systems_to_parts" ADD CONSTRAINT "systems_to_parts_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "systems" ADD CONSTRAINT "systems_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_factory_areas" ADD CONSTRAINT "users_to_factory_areas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_factory_areas" ADD CONSTRAINT "users_to_factory_areas_factory_area_id_factory_areas_id_fk" FOREIGN KEY ("factory_area_id") REFERENCES "public"."factory_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_organizations" ADD CONSTRAINT "users_to_organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_organizations" ADD CONSTRAINT "users_to_organizations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;