CREATE TABLE "threshold" (
	"system_id" text NOT NULL,
	"category" text DEFAULT 'Others' NOT NULL,
	"unit" text NOT NULL,
	"name" text NOT NULL,
	"threshold" real NOT NULL,
	"enabled" boolean NOT NULL,
	CONSTRAINT "threshold_system_id_category_unit_name_pk" PRIMARY KEY("system_id","category","unit","name")
);
--> statement-breakpoint
ALTER TABLE "threshold" ADD CONSTRAINT "threshold_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;