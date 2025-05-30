ALTER TABLE "factory_areas" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "parts_to_system_models" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "system_models" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "systems_to_factory_areas" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users_to_factory_areas" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "factory_areas" CASCADE;--> statement-breakpoint
DROP TABLE "parts_to_system_models" CASCADE;--> statement-breakpoint
DROP TABLE "system_models" CASCADE;--> statement-breakpoint
DROP TABLE "systems_to_factory_areas" CASCADE;--> statement-breakpoint
DROP TABLE "user_settings" CASCADE;--> statement-breakpoint
DROP TABLE "users_to_factory_areas" CASCADE;--> statement-breakpoint
ALTER TABLE "systems" ALTER COLUMN "system_model" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "systems" ADD COLUMN "is_template" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "keys_private_key_system_id_index" ON "keys" USING btree ("private_key","system_id");--> statement-breakpoint
DROP TYPE "public"."system_models_enum";