CREATE TYPE "public"."system_models_enum" AS ENUM('VisioPointer', 'VisioCompact', 'VisioLine', 'SmartInspector', '360 Inspector', 'VisioOne', 'IML-Inspector');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "systems_to_parts" (
	"parts_id" text NOT NULL,
	"system_id" text NOT NULL,
	CONSTRAINT "systems_to_parts_system_id_parts_id_pk" PRIMARY KEY("system_id","parts_id")
);
--> statement-breakpoint
ALTER TABLE "systems" RENAME COLUMN "system_model_id" TO "system_model";--> statement-breakpoint
ALTER TABLE "systems" DROP CONSTRAINT "systems_system_model_id_system_models_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "systems_to_parts" ADD CONSTRAINT "systems_to_parts_parts_id_parts_id_fk" FOREIGN KEY ("parts_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "systems_to_parts" ADD CONSTRAINT "systems_to_parts_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
