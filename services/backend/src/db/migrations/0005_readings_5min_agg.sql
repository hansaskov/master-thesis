-- Custom SQL migration file, put your code below! --
COMMIT;--> statement-breakpoint
CALL refresh_continuous_aggregate('"public"."readings_5min_agg"', NULL, localtimestamp - INTERVAL '1 week');