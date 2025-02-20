DROP TABLE "keys";
CREATE TABLE "keys" (
    "private_key" text PRIMARY KEY NOT NULL,
    "system_id" text NOT NULL,
    "name" text NOT NULL,
    "created_at" timestamp NOT NULL
);
ALTER TABLE "keys" ADD CONSTRAINT "keys_system_id_systems_id_fk" FOREIGN KEY ("system_id") REFERENCES "public"."systems"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "keys" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "keys" ADD CONSTRAINT "keys_private_key_unique" UNIQUE("private_key");