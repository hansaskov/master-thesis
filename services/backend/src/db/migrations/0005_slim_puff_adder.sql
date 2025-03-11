ALTER TABLE "readings" DROP CONSTRAINT "readings_time_system_id_name_pk";--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_system_id_name_time_pk" PRIMARY KEY("system_id","name","time");--> statement-breakpoint
ALTER TABLE "readings" ADD COLUMN "category" text;