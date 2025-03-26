-- Custom SQL migration file, put your code below! --
SELECT add_continuous_aggregate_policy('"public"."readings_5min_agg"',
  start_offset => INTERVAL '1 hour',
  end_offset   => INTERVAL '5 minutes',
  schedule_interval => INTERVAL '5 minutes');