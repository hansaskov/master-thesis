ALTER TABLE "readings" RENAME COLUMN "systems_id" TO "system_id";--> statement-breakpoint
ALTER TABLE "readings" DROP CONSTRAINT "readings_systems_id_systems_id_fk";
--> statement-breakpoint
ALTER TABLE "readings" DROP CONSTRAINT "readings_time_systems_id_name_pk";--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_time_system_id_name_pk" PRIMARY KEY("time","system_id","name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "readings" ADD CONSTRAINT "readings_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
