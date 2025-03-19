ALTER TABLE "readings" DROP CONSTRAINT "readings_system_id_name_time_pk";--> statement-breakpoint
UPDATE "readings" SET "category" = 'Others' WHERE "category" IS NULL;--> statement-breakpoint
ALTER TABLE "readings" ALTER COLUMN "category" SET DEFAULT 'Others';--> statement-breakpoint
ALTER TABLE "readings" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_system_id_category_unit_name_time_pk" PRIMARY KEY("system_id","category","unit","name","time");