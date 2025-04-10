-- Custom SQL migration file, put your code below! --
COMMIT;--> statement-breakpoint
CALL refresh_continuous_aggregate('"public"."system_health"', NULL, localtimestamp - INTERVAL '5 minutes');