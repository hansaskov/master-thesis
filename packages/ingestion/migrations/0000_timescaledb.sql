CREATE TABLE IF NOT EXISTS "conditions" (
	"time" "timestamptz" NOT NULL,
	"name" text NOT NULL,
	"value" real NOT NULL,
	"unit" text NOT NULL
);
--> statement-breakpoint